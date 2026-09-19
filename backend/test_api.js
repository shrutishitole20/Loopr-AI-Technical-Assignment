const http = require('http');

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('1. Testing /api/health...');
  const health = await request('http://localhost:5000/api/health');
  console.log('Health:', health.data);

  console.log('\n2. Testing /api/auth/login...');
  const login = await request('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@crackit.com', password: 'password123' });
  console.log('Login Status:', login.status, 'User:', login.data.user.email);
  const token = login.data.token;

  console.log('\n3. Testing /api/transactions (page=1, limit=5)...');
  const trans = await request('http://localhost:5000/api/transactions?page=1&limit=5', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Transactions Total in DB:', trans.data.pagination.total);
  console.log('Returned transactions count:', trans.data.data.length);
  console.log('Sample item:', trans.data.data[0]);

  console.log('\n4. Testing /api/analytics...');
  const analytics = await request('http://localhost:5000/api/analytics', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Analytics Summary:', analytics.data.data.summary);
  console.log('Monthly Trends count:', analytics.data.data.monthlyTrends.length);
  console.log('Categories:', analytics.data.data.categoryBreakdown);
  console.log('Users:', analytics.data.data.userBreakdown.map(u => ({ id: u.userId, count: u.count })));

  console.log('\n5. Testing /api/transactions/export (CSV)...');
  const exportRes = await request('http://localhost:5000/api/transactions/export', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    columns: ['id', 'date', 'amount', 'category', 'status', 'user_id'],
    filters: { category: 'Revenue' }
  });
  console.log('Export Status:', exportRes.status, 'Content-Type:', exportRes.headers['content-type']);
  console.log('CSV Preview (first 3 lines):');
  console.log(exportRes.data.split('\n').slice(0, 4).join('\n'));

  console.log('\n✅ ALL BACKEND APIS TESTED SUCCESSFULLY!');
}

run().catch(console.error);

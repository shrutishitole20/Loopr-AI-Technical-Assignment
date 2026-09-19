import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Please provide both a valid email and password'
      });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format'
      });
      return;
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const secret = (process.env.JWT_SECRET || 'super_secret_financial_dashboard_jwt_key_2024') as jwt.Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed due to server error'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatarUrl: req.user.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile'
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Name, email and password must be valid strings'
      });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
      return;
    }

    const allowedRoles = ['analyst', 'manager', 'admin'];
    const assignedRole = typeof role === 'string' && allowedRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'analyst';

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: assignedRole
    });

    const secret = (process.env.JWT_SECRET || 'super_secret_financial_dashboard_jwt_key_2024') as jwt.Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};


import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

// Helper to generate next unique Learner ID (Format: LRN-YYYY-0001, LRN-YYYY-0002, etc.)
const generateLearnerId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `LRN-${currentYear}-`;

  const regex = new RegExp(`^LRN-${currentYear}-(\\d+)$`);
  const learners = await User.find({ learnerId: { $regex: regex } })
    .select('learnerId')
    .lean();

  let maxNum = 0;
  for (const l of learners) {
    if (l.learnerId) {
      const match = l.learnerId.match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  const nextNum = maxNum + 1;
  let candidateId = `${prefix}${String(nextNum).padStart(4, '0')}`;

  let counter = nextNum;
  while (await User.findOne({ learnerId: candidateId })) {
    counter++;
    candidateId = `${prefix}${String(counter).padStart(4, '0')}`;
  }

  return candidateId;
};

// @desc    Register a new user (Clinician/Admin/Parent/Learner)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, profileImage } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
      data: null,
    });
  }

  // Automatically generate unique learnerId if registering a learner
  let learnerId = undefined;
  if (role === 'learner') {
    learnerId = await generateLearnerId();
  }

  // Create user
  const userData = {
    fullName,
    email,
    password,
    role: role || 'Clinician',
    profileImage: profileImage || '',
  };

  if (learnerId) {
    userData.learnerId = learnerId;
  }

  const user = await User.create(userData);

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        learnerId: user.learnerId,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
      data: null,
    });
  }

  // Find user and include password for verification
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
      data: null,
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        learnerId: user.learnerId,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        learnerId: user.learnerId,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, profileImage, password, learnerId } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found',
      data: null,
    });
  }

  if (fullName) user.fullName = fullName;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (learnerId !== undefined) user.learnerId = learnerId.trim();
  if (password) user.password = password;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        learnerId: user.learnerId,
        profileImage: user.profileImage,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully. Please clear authentication token from local storage.',
    data: null,
  });
});

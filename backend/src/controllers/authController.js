import User from '../modules/User.js';
import { generateToken } from '../middleware/auth.js';
import logger from '../utiles/logger.js';


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

   
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

 
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }


    user.lastLogin = new Date();
    await user.save();

   
    const token = generateToken(user._id);

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};


export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken',
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    logger.info('User profile updated', {
      userId: user._id,
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};


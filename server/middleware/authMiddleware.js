const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  // Debug: Log cookies and headers
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Headers:', req.headers.cookie);
  
  // Check for token in cookies
  if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token found in cookies:', token.substring(0, 20) + '...');
  }
  
  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.userId).select('-password');
    console.log('User authenticated:', req.user.username);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
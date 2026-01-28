import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No authentication token provided'
      });
    }

    const decoded = jwttoken.verify(token);
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (e) {
    logger.error('Authentication middleware error:', e);
    return res.status(401).json({
      error: 'Access denied',
      message: 'Invalid or expired token'
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    // First ensure user is authenticated
    await requireAuth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access forbidden',
          message: 'Admin privileges required'
        });
      }
      next();
    });
  } catch (e) {
    logger.error('Admin middleware error:', e);
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'Admin privileges required'
    });
  }
};
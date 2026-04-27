const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rrdch_super_secret_key_2026'; // Ensure this matches everywhere

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Middleware for strict Role-Based Access Control
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'User role not found.' });
    }

    if (req.user.role === 'super_admin') {
      return next(); // Super admin bypasses all role checks
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Middleware to ensure user only accesses their own department's data
const checkDepartment = (req, res, next) => {
  if (req.user.role === 'super_admin' || req.user.role === 'admin') {
    return next(); // Admins can access any department
  }

  const requestedDepartmentId = parseInt(req.params.department_id || req.query.department_id || req.body.department_id);
  
  if (requestedDepartmentId && req.user.department_id !== requestedDepartmentId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. You can only access data for your assigned department.' 
    });
  }

  next();
};

module.exports = {
  verifyToken,
  checkRole,
  checkDepartment,
  JWT_SECRET
};

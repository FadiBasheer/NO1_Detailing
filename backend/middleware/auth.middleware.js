import jwt from 'jsonwebtoken';

// Auth middleware
export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access token required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    res.status(401).json({ message: 'Invalid access token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  next();
};
module.exports = (requiredRole) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Forbidden: Insufficient role. Required role: ${requiredRole}` });
    }

    // Continue to the next middleware/handler if role is sufficient
    next();
  };
};
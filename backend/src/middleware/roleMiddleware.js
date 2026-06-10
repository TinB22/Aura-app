const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Nemate ovlasti za ovu akciju",
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
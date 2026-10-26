
exports.requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  next();
};

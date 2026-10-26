require("dotenv").config()
const allowedOrigin = process.env.CLIENT_URL;

const validateOrigin = (req, res, next) => {
  const origin = req.get("Origin");

  // Reject requests without an Origin header.
  if (!origin || origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed",
    });
  }

  next();
};

module.exports = validateOrigin;

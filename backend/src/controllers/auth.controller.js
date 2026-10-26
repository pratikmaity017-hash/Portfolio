const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+passwordHash");

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Regenerate session ID after successful authentication.
    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.adminId = admin._id.toString();

      req.session.save((saveError) => {
        if (saveError) return next(saveError);

        res.status(200).json({
          success: true,
          message: "Login successful",
          admin: {
            id: admin._id,
            email: admin.email,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
exports.logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("portfolio.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
};

// GET /api/auth/me
exports.getCurrentAdmin = async (req, res, next) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const admin = await Admin.findById(req.session.adminId);

    if (!admin) {
      req.session.destroy(() => {});

      return res.status(401).json({
        success: false,
        message: "Admin account not found",
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

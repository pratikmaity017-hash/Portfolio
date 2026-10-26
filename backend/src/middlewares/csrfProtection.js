const crypto = require("crypto");

function generateCsrfToken(req, res) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  res.status(200).json({
    success: true,
    csrfToken: req.session.csrfToken,
  });
}

function verifyCsrfToken(req, res, next) {
  const sessionToken = req.session?.csrfToken;
  const requestToken = req.get("X-CSRF-Token");

  if (typeof sessionToken !== "string" || typeof requestToken !== "string") {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing or invalid",
    });
  }

  const sessionBuffer = Buffer.from(sessionToken);
  const requestBuffer = Buffer.from(requestToken);

  if (
    sessionBuffer.length !== requestBuffer.length ||
    !crypto.timingSafeEqual(sessionBuffer, requestBuffer)
  ) {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing or invalid",
    });
  }

  next();
}

module.exports = {
  generateCsrfToken,
  verifyCsrfToken,
};

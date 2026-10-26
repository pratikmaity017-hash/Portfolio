const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config();

const validateOrigin = require("./middlewares/validateOrigin");

const projectRoutes = require("./routes/project.route");
const authRoutes = require("./routes/auth.route");
const cors = require("cors");
const app = express();
if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is required");
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  }),
);
app.disable("x-powered-by");
app.use(require("helmet")());
app.use(express.json({ limit: "20kb" }));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

app.use(
  session({
    name: "portfolio.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 8,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.use(["/api/auth", "/api/projects"], (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  return validateOrigin(req, res, next);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Portfolio backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

module.exports = app;

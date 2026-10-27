// const express = require("express");
// const session = require("express-session");
// const MongoStore = require("connect-mongo").default;
// require("dotenv").config();

// const validateOrigin = require("./middlewares/validateOrigin");

// const projectRoutes = require("./routes/project.route");
// const authRoutes = require("./routes/auth.route");
// const cors = require("cors");
// const app = express();
// if (!process.env.CLIENT_URL) {
//   throw new Error("CLIENT_URL is required");
// }

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "X-CSRF-Token"],
//   }),
// );
// app.disable("x-powered-by");
// app.use(require("helmet")());
// app.use(express.json({ limit: "20kb" }));

// if (!process.env.SESSION_SECRET) {
//   throw new Error("SESSION_SECRET is required");
// }

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret",
//     resave: false,
//     saveUninitialized: false,
//     name: "portfolio.sid",
//     cookie: {
//       httpOnly: true,
//       secure: false, // লোকাল ডেভেলপমেন্টে (http) false রাখতে হবে
//       sameSite: "lax", // একই হোস্টনেম (localhost) ব্যবহার করলে এটি কাজ করবে
//     },
//   }),
// );

// app.use(["/api/auth", "/api/projects"], (req, res, next) => {
//   const safeMethods = ["GET", "HEAD", "OPTIONS"];

//   if (safeMethods.includes(req.method)) {
//     return next();
//   }

//   return validateOrigin(req, res, next);
// });

// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     message: "Portfolio backend is running",
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// module.exports = app;

const express = require("express");
const session = require("express-session");
const MongoStoreModule = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const validateOrigin = require("./middlewares/validateOrigin");
const projectRoutes = require("./routes/project.route");
const authRoutes = require("./routes/auth.route");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is required");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

const allowedOrigins = process.env.CLIENT_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const MongoStore = MongoStoreModule.default || MongoStoreModule;

// Needed when the production host uses a trusted reverse proxy.
if (isProduction) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  }),
);

app.use(helmet());
app.use(express.json({ limit: "20kb" }));

app.use(
  session({
    name: "portfolio.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
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
    success: true,
    message: "Portfolio backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

module.exports = app;

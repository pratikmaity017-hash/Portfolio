require("dotenv").config();

const required = (key) => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 3000);

const config = {
//   NODE_ENV: nodeEnv,
  PORT: port,
  MONGODB_URI: required("MONGODB_URI"),
//   JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
//   JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
//   CLIENT_URL: required("CLIENT_URL"),
};

module.exports = config
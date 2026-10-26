const app = require("./src/app");
const config = require("./src/config/config");
const connectDB = require("./src/config/db");

const PORT = config.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer()
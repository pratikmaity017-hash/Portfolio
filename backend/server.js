const app = require("./src/app");
const config = require("./src/config/config");
const connectDB = require("./src/config/db");

const PORT = config.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer()
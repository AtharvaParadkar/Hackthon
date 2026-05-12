require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB, sequelize } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const claimRoutes = require("./routes/claim.routes");

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    // sequelize.sync({alter:true})

    app.use("/api/auth", authRoutes);
    app.use("/api/claim", claimRoutes);

    const PORT = 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Keep the process alive in environments where the TCP handle doesn't persist
    setInterval(() => {}, 60000);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
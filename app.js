const express = require("express");
const app = express();
const port = 3000;
const sequelize = require("./utils/database");
const attendenceRoutes = require("./routes/attendenceRoutes");
const cors = require('cors');

// Allow requests from your Frontend (Port 3001)
app.use(cors({
  origin: "*" // Allow all origins (easiest for development)
}));

// Middleware MUST be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", attendenceRoutes);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Backend Server is running on port ${port}!..`);
    });
});
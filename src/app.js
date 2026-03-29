const express = require("express");
const cors = require("cors");

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://pnr-tracker-frontend.vercel.app/"
  ]
}));

app.use(express.json());

app.use("/api/tickets", ticketRoutes);

module.exports = app;
const express = require("express");
const router = express.Router();

const {
  addTicket,
  getTickets,
  refreshTicket,
  toggleAutoTrack
} = require("../controllers/ticketController");

router.post("/", addTicket);
router.get("/", getTickets);
router.get("/refresh/:id", refreshTicket);
router.patch("/toggle/:id", toggleAutoTrack);

module.exports = router;
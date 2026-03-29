const express = require("express");
const router = express.Router();

const {
  addTicket,
  getTickets,
  getSelectedTickets,
  deleteSelectedTickets,
  refreshTicket,
  toggleAutoTrack
} = require("../controllers/ticketController");

router.post("/", addTicket);
router.get("/", getTickets);
router.post("/selected", getSelectedTickets);
router.delete("/selected", deleteSelectedTickets);
router.get("/refresh/:id", refreshTicket);
router.patch("/toggle/:id", toggleAutoTrack);

module.exports = router;
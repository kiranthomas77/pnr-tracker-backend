const Ticket = require("../models/Ticket");
const { getPNRStatus } = require("../services/pnrService");

// Add Ticket
const addTicket = async (req, res) => {
  try {
    const { pnr, journeyDate, telegramChatId } = req.body;

    const ticket = await Ticket.create({
      pnr,
      journeyDate,
      notify: { telegramChatId }
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tickets
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const refreshTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const result = await getPNRStatus(ticket.pnr);

    ticket.previousStatus = ticket.currentStatus;
    ticket.currentStatus = result.currentStatus;
    ticket.lastChecked = new Date();

    await ticket.save();

    res.json({
      message: "Ticket refreshed",
      ticket
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleAutoTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    ticket.autoTrack = !ticket.autoTrack;

    await ticket.save();

    res.json({
      message: "Auto tracking toggled",
      autoTrack: ticket.autoTrack
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addTicket,
  getTickets,
  refreshTicket,
  toggleAutoTrack
};
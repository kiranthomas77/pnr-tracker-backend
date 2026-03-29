const Ticket = require("../models/Ticket");
const { getPNRStatus } = require("../services/pnrService");

// Add Ticket
const addTicket = async (req, res) => {
  try {
    const { pnr, telegramChatId } = req.body;

    const existingTicket = await Ticket.findOne({ pnr });
    if (existingTicket) {
      return res.status(400).json({ error: "Ticket already exists" });
    }

    const pnrDataRes = await getPNRStatus(pnr);
    
    if (!pnrDataRes.success || !pnrDataRes.data) {
       return res.status(400).json({ error: "Could not fetch PNR details" });
    }
    const apiData = pnrDataRes.data;

    let journeyDate;
    if (apiData.dateOfJourney) {
      journeyDate = new Date(apiData.dateOfJourney); // Attempt to parse Date
    }

    const ticket = await Ticket.create({
      pnr,
      journeyDate,
      dateOfJourney: apiData.dateOfJourney,
      trainNumber: apiData.trainNumber,
      trainName: apiData.trainName,
      sourceStation: apiData.sourceStation,
      destinationStation: apiData.destinationStation,
      chartStatus: apiData.chartStatus,
      numberOfpassenger: apiData.numberOfpassenger,
      ticketFare: apiData.ticketFare,
      distance: apiData.distance,
      passengerList: apiData.passengerList?.map(p => ({
        passengerSerialNumber: p.passengerSerialNumber,
        bookingStatusDetails: p.bookingStatusDetails,
        currentStatus: p.currentStatus,
        currentStatusDetails: p.currentStatusDetails
      })) || [],
      currentStatus: pnrDataRes.currentStatus,
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

// Get Selected Tickets
const getSelectedTickets = async (req, res) => {
  try {
    const { pnrs } = req.body;
    if (!pnrs || !Array.isArray(pnrs)) {
      return res.status(400).json({ error: "Please provide an array of pnrs" });
    }
    const tickets = await Ticket.find({ pnr: { $in: pnrs } }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Selected Tickets
const deleteSelectedTickets = async (req, res) => {
  try {
    const { pnrs } = req.body;
    if (!pnrs || !Array.isArray(pnrs)) {
      return res.status(400).json({ error: "Please provide an array of pnrs" });
    }
    const result = await Ticket.deleteMany({ pnr: { $in: pnrs } });
    res.json({
      message: "Tickets deleted",
      deletedCount: result.deletedCount
    });
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

    if (result.success && result.data) {
      const apiData = result.data;
      ticket.chartStatus = apiData.chartStatus;
      ticket.numberOfpassenger = apiData.numberOfpassenger;
      ticket.ticketFare = apiData.ticketFare;
      ticket.distance = apiData.distance;
      if (apiData.passengerList) {
        ticket.passengerList = apiData.passengerList.map(p => ({
          passengerSerialNumber: p.passengerSerialNumber,
          bookingStatusDetails: p.bookingStatusDetails,
          currentStatus: p.currentStatus,
          currentStatusDetails: p.currentStatusDetails
        }));
      }
    }

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
  getSelectedTickets,
  deleteSelectedTickets,
  refreshTicket,
  toggleAutoTrack
};
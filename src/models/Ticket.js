const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  journeyDate: {
    type: Date // Kept for backwards compatibility if needed, but not strictly required initially
  },
  dateOfJourney: {
    type: String
  },
  trainNumber: {
    type: String
  },
  trainName: {
    type: String
  },
  sourceStation: {
    type: String
  },
  destinationStation: {
    type: String
  },
  chartStatus: {
    type: String
  },
  numberOfpassenger: {
    type: Number
  },
  ticketFare: {
    type: Number
  },
  distance: {
    type: Number
  },
  passengerList: [{
    passengerSerialNumber: Number,
    bookingStatusDetails: String,
    currentStatus: String,
    currentStatusDetails: String
  }],

  currentStatus: {
    type: String,
    default: "UNKNOWN"
  },
  previousStatus: {
    type: String
  },

  lastChecked: {
    type: Date
  },

  notify: {
    telegramChatId: String
  },

  autoTrack: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  journeyDate: {
    type: Date,
    required: true
  },

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
const mongoose = require('mongoose');
require('dotenv').config();
const Ticket = require('./src/models/Ticket');

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
  const tickets = await Ticket.find({});
  console.log("Found", tickets.length, "tickets");
  for (const t of tickets) {
    console.log(`Ticket: ${t.pnr}, train: ${t.trainName}/${t.trainNumber}, src: ${t.sourceStation}, dest: ${t.destinationStation}`);
  }
  process.exit(0);
}).catch(console.error);

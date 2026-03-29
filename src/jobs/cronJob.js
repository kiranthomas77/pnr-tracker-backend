const cron = require("node-cron");
const Ticket = require("../models/Ticket");
const { getPNRStatus } = require("../services/pnrService");
const sendTelegramMessage = require("../utils/telegram");

const startCron = () => {
  cron.schedule("*/15 * * * *", async () => {
    console.log("⏳ Running PNR status check...");

    const tickets = await Ticket.find({ autoTrack: true });

    for (let ticket of tickets) {
      try {
        const result = await getPNRStatus(ticket.pnr);

        const newStatus = result.currentStatus;

        // 🔁 Detect change
        if (ticket.currentStatus !== newStatus) {

          console.log(`PNR ${ticket.pnr} changed: ${ticket.currentStatus} → ${newStatus}`);

          ticket.previousStatus = ticket.currentStatus;
          ticket.currentStatus = newStatus;

          // 🔔 Send notification
          if (ticket.notify?.telegramChatId) {
            await sendTelegramMessage(
              ticket.notify.telegramChatId,
              `🚆 PNR ${ticket.pnr} update:\n${ticket.previousStatus} → ${newStatus}`
            );
          }
        }

        ticket.lastChecked = new Date();
        await ticket.save();

      } catch (err) {
        console.error("Error processing PNR:", ticket.pnr, err.message);
      }
    }

  });
};

module.exports = startCron;
const axios = require("axios");

const sendTelegramMessage = async (chatId, message) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: message
      }
    );
  } catch (error) {
    console.error("Telegram Error:", error.message);
  }
};

module.exports = sendTelegramMessage;
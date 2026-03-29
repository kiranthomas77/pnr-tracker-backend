const axios = require("axios");

const getPNRStatus = async (pnr) => {
  try {
    const response = await axios.get(
      `${process.env.PNR_API_URL}/${pnr}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.PNR_API_KEY,
          "X-RapidAPI-Host": "irctc-indian-railway-pnr-status.p.rapidapi.com"
        }
      }
    );

    const data = response.data;

    console.log("API RAW RESPONSE:", data);

    return {
      pnr,
      currentStatus: data?.data?.currentStatus || "UNKNOWN"
    };

  } catch (error) {
    console.error("PNR API Error:", error.response?.data || error.message);

    return {
      pnr,
      currentStatus: "UNKNOWN"
    };
  }
};

module.exports = { getPNRStatus };
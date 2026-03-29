require('dotenv').config();
const { getPNRStatus } = require('./src/services/pnrService');

getPNRStatus("4232679760").then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(console.error);

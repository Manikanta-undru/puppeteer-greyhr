const express = require('express');
const { signInIntoGreyHr } = require('./greyHr');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

const datesToRun = JSON.parse(process.env.DATES_TO_RUN);

app.get('/', (req, res) => {
  res.send('Hello, Puppeteer server is running!');
});

app.get('/signIn', (req, res) => {
  console.log('Date to run:', datesToRun);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  console.log('currentMonth:', currentMonth);
  console.log('currentDate:', currentDate.getDate());
  if (datesToRun[currentMonth].includes(currentDate.getDate())) {
    console.log('Date is in the list');
    signInIntoGreyHr(req, res);
  } else {
    console.log('Date is not in the list');
    res.send('Date is not in the list');
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


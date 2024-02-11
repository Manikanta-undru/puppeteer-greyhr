const express = require('express');
const { signInIntoGreyHr } = require('./greyHr');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello, Puppeteer server is running!');
});

app.get('/signIn', (req, res) => {
   signInIntoGreyHr(req, res);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


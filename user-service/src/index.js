require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('pino')();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error(err));

app.get('/', (req, res) => {
  res.send('User Service is up and running!');
});

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});

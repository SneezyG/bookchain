require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('pino')();

const userRoutes = require('./routes/users');
const startConsumer = require('./events/consumer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.get('/', (req, res) => {
  res.send('User Service is up and running!');
});

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('MongoDB connected');

  // Start the RabbitMQ consumer
  startConsumer(logger);

  // Start the Express server
  app.listen(PORT, () => {
    logger.info(`User Service running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  logger.error('Express fail to start:', err);
  process.exit(1);
});

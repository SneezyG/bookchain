require('dotenv').config();
const Fastify = require('fastify');
const mongoose = require('mongoose');
const { addBook, getBook } = require('./routes/books');
const startConsumer = require('./events/consumer');

// Create Fastify app with default Pino logging
const app = Fastify({ logger: true });

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.log.info('MongoDB connected');

  // Start RabbitMQ consumer and pass logger
  startConsumer(app.log);

  // Register routes
  app.get('/', async (request, reply) => {
    return { message: 'Book Service is up and running!' };
  });
  app.post('/books', addBook);
  app.get('/books/:id', getBook);

  // Start the server after successful DB connection
  const PORT = process.env.PORT || 5001;
  app.listen({ port: PORT })
    .then((address) => {
      app.log.info(`Book Service running at ${address}`);
    })
    .catch((err) => {
      app.log.error('Fastify failed to start:', err);
      process.exit(1);
    });

})
.catch((err) => {
  app.log.error('Fastify fail to start:', err);
  process.exit(1);
});

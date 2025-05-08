require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5001;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => fastify.log.info('MongoDB connected'))
  .catch((err) => fastify.log.error(err));

// Basic route
fastify.get('/', async (request, reply) => {
  return { message: 'Book Service is up and running!' };
});

// Start server
const start = () => {
  try {
    fastify.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

require('dotenv').config();
const Koa = require('koa');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const router = require('./routes/loans');
const logger = require('pino')();

const app = new Koa();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser());

// Index route
router.get('/', async (ctx) => {
  ctx.body = { message: 'Loan Service is up and running!' };
});

// Other routes
app.use(router.routes()).use(router.allowedMethods());

// Mongo + server boot
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('MongoDB connected');

  app.listen(PORT, () => {
    logger.info(`Loan Service running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  logger.error('Koa fail to start:', err);
  process.exit(1);
});

require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const mongoose = require('mongoose');
const logger = require('pino')();

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error(err));

router.get('/', (ctx) => {
  ctx.body = 'Loan Service is up and running!';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});

const amqp = require('amqplib');
const logger = require('pino')();

let channel;

async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
}

async function publishLoanCreated(loan) {
  if (!channel) await connect();
  const payload = {
    loanId: loan._id,
    userId: loan.userId,
    bookId: loan.bookId,
  };

  logger.info(`LoanCreated event: ${JSON.stringify(payload)}`);

  await channel.assertExchange('LoanCreated', 'fanout', { durable: true });
  channel.publish('LoanCreated', '', Buffer.from(JSON.stringify(payload)));
}

async function publishLoanReturned(loan) {
  if (!channel) await connect();
  const payload = {
    loanId: loan._id,
    userId: loan.userId,
    bookId: loan.bookId,
  };

  logger.info(`LoanReturned event: ${JSON.stringify(payload)}`);

  await channel.assertExchange('LoanReturned', 'fanout', { durable: true });
  channel.publish('LoanReturned', '', Buffer.from(JSON.stringify(payload)));
}

module.exports = { publishLoanCreated, publishLoanReturned };

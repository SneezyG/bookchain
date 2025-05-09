const amqp = require('amqplib');
const Book = require('../models/Book');

async function startConsumer(logger) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange('LoanCreated', 'fanout', { durable: true });
    await channel.assertExchange('LoanReturned', 'fanout', { durable: true });
    
    const { queue: loanCreatedQueue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(loanCreatedQueue, 'LoanCreated', '');

    const { queue: loanReturnedQueue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(loanReturnedQueue, 'LoanReturned', '');

    channel.consume(loanCreatedQueue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const { bookId, userId, loanId } = data;

      logger.info(`LoanCreated event: ${JSON.stringify(data)}`);

      await Book.findByIdAndUpdate(bookId, {
        available: false,
        currentLoan: loanId,
        currentHolder: userId,
      });

      channel.ack(msg);
    });

    channel.consume(loanReturnedQueue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const { bookId } = data;

      logger.info(`LoanReturned event: ${JSON.stringify(data)}`);

      await Book.findByIdAndUpdate(bookId, {
        available: true,
        currentLoan: null,
        currentHolder: null,
      });

      channel.ack(msg);
    });

    logger.info('RabbitMQ consumer is running...');
  } catch (err) {
    logger.error('Consumer error:', err);
  }
}

module.exports = startConsumer;

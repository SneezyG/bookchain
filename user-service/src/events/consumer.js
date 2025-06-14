const amqp = require('amqplib');
const User = require('../models/User');


async function startConsumer(logger) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // create exchanges that queues will bind to
    await channel.assertExchange('LoanCreated', 'fanout', { durable: true });
    await channel.assertExchange('LoanReturned', 'fanout', { durable: true });
    
    // create and bind loan created queue
    const { queue: loanCreatedQueue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(loanCreatedQueue, 'LoanCreated', '');
    
    // create and bind loan returned queue
    const { queue: loanReturnedQueue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(loanReturnedQueue, 'LoanReturned', '');
    
    // start a consumer for loan created queue
    channel.consume(loanCreatedQueue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const { userId, bookId, loanId } = data;

      logger.info(`LoanCreated event: ${JSON.stringify(data)}`);

      await User.findByIdAndUpdate(userId, {
        $push: {
          loanHistory: loanId,
          bookHistory: bookId,
          currentBooks: bookId
        }
      });

      channel.ack(msg);
    });
    
    // start a consumer for loan returned queue
    channel.consume(loanReturnedQueue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const { userId, bookId } = data;

      logger.info(`LoanReturned event: ${JSON.stringify(data)}`);

      await User.findByIdAndUpdate(userId, {
        $pull: { currentBooks: bookId }
      });

      channel.ack(msg);
    });

    logger.info('RabbitMQ consumer running...');
  } catch (err) {
    logger.error('Error setting up RabbitMQ consumer:', err);
  }
}

module.exports = startConsumer;

const Router = require('@koa/router');
const Loan = require('../models/Loan');
const { publishLoanCreated, publishLoanReturned } = require('../events/publisher');


const router = new Router();


// create a new loan and publish it event
router.post('/loans', async (ctx) => {
  const { userId, bookId, dueDate } = ctx.request.body;

  const loan = new Loan({ userId, bookId, dueDate });
  await loan.save();

  await publishLoanCreated(loan);

  ctx.status = 201;
  ctx.body = loan;
});



// mark a loan completed and publish it event
router.get('/loans/:id/return', async (ctx) => {
  const { id } = ctx.params;

  const loan = await Loan.findById(id);
  if (!loan || loan.status !== 'active') {
    ctx.status = 404;
    ctx.body = { error: 'Loan not found or already returned' };
    return;
  }

  loan.returnedAt = new Date();
  loan.status = 'returned';
  await loan.save();

  await publishLoanReturned(loan);

  ctx.body = loan;
});



module.exports = router;

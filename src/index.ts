import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { router as authRouter } from './modules/auth/auth.controller';
import { router as tourRouter } from './modules/tour/tour.controller';
import { router as usersRouter } from './modules/users/users.controller';
import { router as locationRouter } from './modules/location/location.controller';
import { router as orderRouter } from './modules/orderPay/order_pay.controller';
import { router as messageRouter } from './modules/messages/message.controller';
import { router as messageLcoationRouter } from './modules/messagesLocation/message-location.controller';
// import { router as categoryRouter } from './modules/category/category.controller';
import { auth } from './middlewares/auth';
import { errorFilter } from './middlewares/error-filter';

const app = new Hono().basePath('/api');

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://travel-memorytour.vercel.app'],
    credentials: true,
  })
);
app.route('/', authRouter);

// app.all('*', auth).route('/orgs', orgsRouter);
app.route('/users', usersRouter);
app.route('/tour', tourRouter);
app.route('/location', locationRouter);
app.route('/order', orderRouter);
app.route('/message', messageRouter);
app.route('/message_location', messageLcoationRouter);
// app.all('*', auth).route('/category', categoryRouter);

app.notFound((c) => c.json({ status: 404, message: 'Not found' }, 404));

app.onError(errorFilter);

serve({
  fetch: app.fetch,
  port: 5000,
});

serve(app, () => {
  console.log('🤖 Server is running on http://localhost:5000');
});

import { OrderPayService } from '@/modules/orderPay/order_pay.service';
import { Hono } from 'hono';

export const router = new Hono();

router
  .get('/', async (c) => {
    const user = c.get('user');
    const data = await OrderPayService.getAll(user?.id);
    return c.json(JSON.stringify(data));
  })
  .post('/', async (c) => {
    const user = c.get('user');
    const orderDto = await c.req.json();
    const data = await OrderPayService.createAddCard(orderDto, user?.id);
    return c.json(JSON.stringify(data));
  });

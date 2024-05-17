import { db } from '@/lib/db';
import { paginationSchema } from '@/utils/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { auth } from '@/middlewares/auth';
import { checkRole } from '@/middlewares/role';
import { MessageService } from '@/modules/messages/message.service';

export const router = new Hono();

router
  .get('/:tourId', auth, async (c) => {
    const tourId = c.req.param('tourId');
    const messages = await MessageService.getAll(tourId);
    return c.json({
      data: messages,
    });
  })
  .post('/:tourId/message', async (c) => {
    const user = c.get('user');
    const tourId = c.req.param('tourId');
    const createMessageDto = await c.req.json();
    const message = await MessageService.create(user, tourId, createMessageDto);
    return c.json({
      data: message,
      status: 201,
    });
  });

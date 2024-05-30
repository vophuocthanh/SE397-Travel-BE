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
  })
  .get('/:locationId', async (c) => {
    const locationId = c.req.param('locationId');
    const messages = await MessageService.getAllLocation(locationId);
    return c.json({
      data: messages,
    });
  })
  .post('/:locationId/message', auth, async (c) => {
    const user = c.get('user');
    const locationId = c.req.param('locationId');
    const createMessageLocationDto = await c.req.json();
    const message = await MessageService.createLocation(
      user,
      locationId,
      createMessageLocationDto
    );
    return c.json({
      data: message,
      status: 201,
    });
  })
  .delete('/:messageId', auth, async (c) => {
    const messageId = c.req.param('messageId');
    await MessageService.delete(messageId);
    return c.json({
      status: 200,
      message: 'Message deleted successfully',
    });
  });

import { db } from '@/lib/db';
import { paginationSchema } from '@/utils/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { auth } from '@/middlewares/auth';
import { checkRole } from '@/middlewares/role';
import { MessageLocationService } from '@/modules/messagesLocation/message.-location.service';

export const router = new Hono();

router
  .get('/:locationId', auth, async (c) => {
    const locationId = c.req.param('locationId');
    const messages = await MessageLocationService.getAllLocation(locationId);
    return c.json({
      data: messages,
    });
  })
  .post('/:locationId/message', async (c) => {
    const user = c.get('user');
    const locationId = c.req.param('locationId');
    const createMessageLocationDto = await c.req.json();
    const message = await MessageLocationService.createLocation(
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
    await MessageLocationService.delete(messageId);
    return c.json({
      status: 200,
      message: 'Message deleted successfully',
    });
  });

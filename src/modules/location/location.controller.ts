import { db } from '@/lib/db';
import { paginationSchema } from '@/utils/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { auth } from '@/middlewares/auth';
import { LocationService } from './location.service';

export const router = new Hono();

router
  .get('/', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const search = c.req.query('search');
    const page = +c.req.query('page') || 1;
    const limit = +c.req.query('limit') || 6;
    const pagination = {
      skip: (page - 1) * limit,
    };

    const data = await LocationService.getAll(user?.id, {
      page,
      limit,
      search,
      ...pagination,
    });
    return c.json(data);
  })
  .get('/:locationId', async (c) => {
    const orgId = c.req.param('locationId');
    const location = await LocationService.getById(orgId);
    return c.json({ data: location });
  })
  .post('/', auth, async (c) => {
    const user = c.get('user');
    const createLocationInput = await c.req.json();
    const location = await LocationService.create({
      usersID: user?.id,
      ...createLocationInput,
    });
    return c.json({
      data: location,
      status: 201,
    });
  })
  .put('/:locationId', auth, async (c) => {
    const locationId = c.req.param('locationId');
    const updateDto = await c.req.json();
    const updateLocation = await LocationService.update(locationId, updateDto);
    return c.json({ data: updateLocation, status: 200 });
  })
  .delete('/:locationId', auth, async (c) => {
    const locationId = c.req.param('locationId');
    await LocationService.delete(locationId);
    return c.json({ status: 200 });
  });

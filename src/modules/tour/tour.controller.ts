import { db } from '@/lib/db';
import { paginationSchema } from '@/utils/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { TourService } from './tour.service';

export const router = new Hono();

router
  .get('/', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const search = c.req.query('search');
    const page = +c.req.query('page') || 1;
    const limit = +c.req.query('limit') || 3;

    const data = await TourService.getAll(user?.id, {
      page,
      limit,
      search,
    });

    return c.json(data);
  })
  .get('/:tourId', async (c) => {
    const orgId = c.req.param('tourId');

    const org = await TourService.getById(orgId);

    return c.json({
      data: org,
      status: 200,
    });
  })
  .post('/', async (c) => {
    const user = c.get('user');
    const { name, image, description, location } = await c.req.json();
    const tour = await TourService.create({
      name,
      image,
      description,
      location,
      usersID: user?.id,
    });
    return c.json({
      data: tour,
    });
  })
  .put('/:tourId', async (c) => {
    const tourId = c.req.param('tourId');
    const updateTourDto = await c.req.json();
    const updateTour = await TourService.update(tourId, updateTourDto);
    return c.json({
      data: updateTour,
      status: 200,
    });
  })
  .delete('/:tourId', async (c) => {
    const tourId = c.req.param('tourId');
    await TourService.delete(tourId);
    return c.json({
      status: 200,
      message: 'Tour deleted successfully',
    });
  });

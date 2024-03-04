import { db } from '@/lib/db';
import { paginationSchema } from '@/utils/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { TourService } from './tour.service';
import { auth } from '@/middlewares/auth';

export const router = new Hono();

router
  .get('/', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const search = c.req.query('search');
    const page = +c.req.query('page') || 1;
    const limit = +c.req.query('limit') || 3;
    const pagination = {
      skip: (page - 1) * limit,
    };

    const data = await TourService.getAll(user?.id, {
      page,
      limit,
      search,
      ...pagination,
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
  .post('/', auth, async (c) => {
    const user = c.get('user');
    const createTourInput = await c.req.json();
    const tour = await TourService.create({
      usersID: user?.id,
      ...createTourInput,
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

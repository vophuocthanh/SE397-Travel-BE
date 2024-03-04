import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@/utils/exceptions';

export const TourService = {
  getAll: async (userId: string, { page = 1, limit = 6, search = '' }) => {
    const tour = await db.tour.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        usersID: userId,
        name: {
          contains: search,
        },
      },
    });
    const total = await db.tour.count({
      where: {
        usersID: userId,
        name: {
          contains: search,
        },
      },
    });

    return {
      data: tour,
      total: total,
      totalPage: Math.ceil(total / limit),
    };
  },
  getById: async (tourId: string) => {
    const tour = await db.tour.findUnique({
      where: {
        id: tourId,
      },
    });
    return tour;
  },
  create: async (tour: Prisma.TourCreateInput) => {
    const createTour = await db.tour.create({
      data: tour,
    });
    return createTour;
  },
  update: async (tourId: string, updateTourDto: Prisma.TourUpdateInput) => {
    const updateTour = await db.tour.update({
      where: {
        id: tourId,
      },
      data: updateTourDto,
    });
    return updateTour;
  },
  delete: async (tourId: string) => {
    await db.tour.delete({
      where: {
        id: tourId,
      },
    });
  },
};

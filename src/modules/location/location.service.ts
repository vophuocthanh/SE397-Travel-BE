import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@/utils/exceptions';

export const LocationService = {
  getAll: async (userId: string, { page = 1, limit = 10, search = '' }) => {
    const location = await db.location.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        usersID: userId,
        country: {
          contains: search,
        },
      },
    });
    const total = await db.location.count({
      where: {
        usersID: userId,
        country: {
          contains: search,
        },
      },
    });

    return {
      data: location,
      total: total,
      totalPage: Math.ceil(total / limit),
    };
  },
  getById: async (locationId: string) => {
    const location = await db.location.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!location) {
      throw new BadRequestException('Location not found');
    }

    const locationCount = await db.location.count({
      where: {
        id: locationId,
      },
    });

    if (locationCount === 0) {
      throw new BadRequestException('Location not found');
    }

    const maxCount = parseInt(location.count || '0', 10);

    const remainingCount = maxCount - locationCount;
    return {
      data: location,
      remainingCount: Math.max(0, remainingCount),
    };
  },
  create: async (location: Prisma.LocationCreateInput) => {
    const createLocation = await db.location.create({
      data: location,
    });
    return createLocation;
  },
  update: async (
    locationId: string,
    updateLocationDto: Prisma.LocationUpdateInput
  ) => {
    const updateLocation = await db.location.update({
      where: {
        id: locationId,
      },
      data: updateLocationDto,
    });
    return updateLocation;
  },
  delete: async (locationId: string) => {
    await db.location.delete({
      where: {
        id: locationId,
      },
    });
  },
};

import { db } from '@/lib/db';
import { Prisma, User } from '@prisma/client';
import { BadRequestException } from '@/utils/exceptions';

export const MessageService = {
  getAll: async (tourId: string) => {
    const message = await db.message.findMany({
      where: {
        tour: {
          id: tourId,
        },
      },
    });
    return {
      data: message,
    };
  },
  create: async (
    user: User,
    tourId: string,
    createMessageDto: Prisma.MessageCreateInput
  ) => {
    const userId = user ? user.id : null;

    const message = await db.message.create({
      data: {
        userID: userId,
        tour: {
          connect: {
            id: tourId,
          },
        },
        ...createMessageDto,
      },
    });
    return message;
  },
  getAllLocation: async (locationId: string) => {
    const message = await db.messageLocation.findMany({
      where: {
        Location: {
          id: locationId,
        },
      },
    });
    return {
      data: message,
    };
  },
  createLocation: async (
    user: User,
    locationId: string,
    createMessageLocationDto: Prisma.MessageLocationCreateInput
  ) => {
    const userId = user ? user.id : null;

    const message = await db.messageLocation.create({
      data: {
        userID: userId,
        Location: {
          connect: {
            id: locationId,
          },
        },
        ...createMessageLocationDto,
      },
    });
    return message;
  },
  delete: async (messageId: string) => {
    await db.message.delete({
      where: {
        id: messageId,
      },
    });
  },
};

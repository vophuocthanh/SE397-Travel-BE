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
};

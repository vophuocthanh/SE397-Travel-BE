import { db } from '@/lib/db';
import { BadRequestException, UnauthorizedException } from '@/utils/exceptions';
import { Prisma } from '@prisma/client';

export const OrderPayService = {
  getAll: async (userId: string) => {
    const orderPay = await db.odersPay.findMany({
      where: {
        usersID: userId,
      },
    });

    return {
      data: orderPay,
    };
  },
  createAddCard: async (
    tourId: string,
    orderDto: Prisma.OdersPayCreateInput
  ) => {
    try {
      const newOrderPay = await db.odersPay.create({
        data: {
          ...orderDto,
        },
      });
      return newOrderPay;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P1001'
      ) {
        throw new UnauthorizedException(`User ${tourId} not found`);
      } else {
        throw error;
      }
    }
  },
};

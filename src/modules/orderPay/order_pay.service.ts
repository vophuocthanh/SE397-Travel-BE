import { db } from '@/lib/db';
import { BadRequestException } from '@/utils/exceptions';
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
    orderDto: Prisma.OdersPayCreateInput,
    tourId: string
  ) => {
    await db.odersPay.create({
      data: {
        ...orderDto,
      },
    });
    const tour = await db.tour.findUnique({
      where: {
        id: tourId,
      },
    });
    if (!tour) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    if (tour.remainingCount === 0) {
      throw new BadRequestException('Sản phẩm đa het');
    }

    const updateTour = await db.tour.update({
      where: {
        id: tourId,
      },
      data: {
        remainingCount: tour.remainingCount,
      },
    });
    return updateTour;
  },
};

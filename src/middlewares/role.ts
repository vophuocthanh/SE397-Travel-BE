import { ForbiddenException } from '@/utils/exceptions';
import { Role } from '@prisma/client';
import { Context } from 'hono';

export const checkRole = async (c: Context, next: Function) => {
  const user = c.get('user');

  if (!user || user.role !== Role.ADMIN) {
    throw new ForbiddenException('Forbidden');
  }

  await next();
};

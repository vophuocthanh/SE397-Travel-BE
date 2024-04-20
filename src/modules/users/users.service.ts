import { db } from '@/lib/db';
import { User } from '@prisma/client';

export const UsersService = {
  updateMe: async (user: User, updateMeDto: { fullName: string }) => {
    const { password, salt, email, ...me } = await db.user.update({
      where: {
        id: user.id,
      },
      data: updateMeDto,
    });

    return me;
  },
  getUserById: async (userID: string) => {
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });
    return user;
  },
  getByUsername: async (username: string) => {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  },
  getUsers: async () => {
    const users = await db.user.findMany();
    return users;
  },
  deleteMe: async (userID: string) => {
    await db.user.delete({
      where: {
        id: userID,
      },
    });
  },
  updateUserAdmin: async (
    userID: string,
    updateMeDto: { fullName: string }
  ) => {
    const user = await db.user.update({
      where: {
        id: userID,
      },
      data: updateMeDto,
    });
    return user;
  },
};

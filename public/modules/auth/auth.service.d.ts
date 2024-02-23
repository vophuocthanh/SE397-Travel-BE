import { User } from '@prisma/client';
export declare class AuthService {
    static signIn(email: string, password: string): Promise<{
        accessToken: any;
    }>;
    static signUp(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string;
        salt: string;
    }>;
    static createToken(userID: string): any;
    static forgotPassword(email: string): Promise<void>;
    static resetPassword(user: User, newPassword: string): Promise<void>;
}

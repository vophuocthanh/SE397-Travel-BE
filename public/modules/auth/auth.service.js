"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../lib/db");
const mail_service_1 = require("../../lib/mail.service");
const constants_1 = require("../../utils/constants");
const exceptions_1 = require("../../utils/exceptions");
const password_1 = require("../../utils/password");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24;
class AuthService {
    static async signIn(email, password) {
        const user = await db_1.db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new exceptions_1.UnauthorizedException(`Email ${email} not found`);
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new exceptions_1.UnauthorizedException(`Invalid password`);
        }
        const accessToken = this.createToken(user.id);
        return { accessToken };
    }
    static async signUp(email, password) {
        try {
            if (!email || !password) {
                throw new exceptions_1.BadRequestException(`Email and password are required`);
            }
            const salt = bcrypt.genSaltSync();
            const hashedPassword = await (0, password_1.hashPassword)(password, salt);
            const newUser = await db_1.db.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    salt: salt,
                },
            });
            return newUser;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new exceptions_1.UnauthorizedException(`User ${email} already exists`);
            }
            else {
                throw error;
            }
        }
    }
    static createToken(userID) {
        return jsonwebtoken_1.default.sign({ userID: userID }, constants_1.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });
    }
    static async forgotPassword(email) {
        const user = await db_1.db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new exceptions_1.BadRequestException(`Email ${email} not found`);
        }
        const accessToken = this.createToken(user.id);
        await mail_service_1.mailService.sendMail({
            to: email,
            html: `Click <a href="${constants_1.WEB_URL}/reset-password?token=${accessToken}">here</a> to reset your password`,
            subject: 'Reset  password',
        });
    }
    static async resetPassword(user, newPassword) {
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new exceptions_1.BadRequestException(`New password cannot be the same as old password`);
        }
        const salt = bcrypt.genSaltSync();
        const hashedPassword = await (0, password_1.hashPassword)(newPassword, salt);
        await db_1.db.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                salt: salt,
            },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
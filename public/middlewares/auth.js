"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exceptions_1 = require("../utils/exceptions");
const db_1 = require("../lib/db");
const constants_1 = require("../utils/constants");
const auth = async (c, next) => {
    try {
        const authHeader = c.req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new exceptions_1.UnauthorizedException('Unauthorized');
        }
        const data = jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
        const user = await db_1.db.user.findUnique({
            where: {
                id: data.userID,
            },
        });
        c.set('user', user);
        await next();
    }
    catch (error) {
        console.log(error);
        throw new exceptions_1.UnauthorizedException('Unauthorized');
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map
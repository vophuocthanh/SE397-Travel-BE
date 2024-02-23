"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const hono_1 = require("hono");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const zod_validator_1 = require("@hono/zod-validator");
const auth_1 = require("../../middlewares/auth");
exports.router = new hono_1.Hono();
exports.router
    .post('/sign-in', (0, zod_validator_1.zValidator)('json', auth_dto_1.signInDto), async (c) => {
    const { email, password } = await c.req.json();
    const data = await auth_service_1.AuthService.signIn(email, password);
    return c.json(data, 200);
})
    .post('/sign-up', (0, zod_validator_1.zValidator)('json', auth_dto_1.signUpDto), async (c) => {
    const { email, password } = await c.req.json();
    await auth_service_1.AuthService.signUp(email, password);
    return c.json({
        message: 'Sign up successfully. Please check your email to verify your account.',
    }, 201);
})
    .post('/forgot-password', (0, zod_validator_1.zValidator)('json', auth_dto_1.forgotPasswordDto), async (c) => {
    const { email } = await c.req.json();
    await auth_service_1.AuthService.forgotPassword(email);
    return c.json({
        message: 'Reset password link has been sent to your email. Please check your email to reset your password.',
    }, 201);
})
    .put('/reset-password', auth_1.auth, (0, zod_validator_1.zValidator)('json', auth_dto_1.resetPasswordDto), async (c) => {
    const user = c.get('user');
    const { password } = await c.req.json();
    await auth_service_1.AuthService.resetPassword(user, password);
    return c.json({
        message: 'Your password has been reset successfully. Please login with your new password.',
    }, 200);
});
//# sourceMappingURL=auth.controller.js.map
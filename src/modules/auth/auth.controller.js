"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const response_1 = require("../../shared/response");
const errors_1 = require("../../shared/errors");
const authService = new auth_service_1.AuthService();
const userService = new user_service_1.UserService();
class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            (0, response_1.sendSuccess)({
                res,
                message: "Login berhasil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            (0, response_1.sendSuccess)({
                res,
                message: "Token berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            (0, response_1.sendSuccess)({
                res,
                message: "Logout berhasil",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async profile(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await userService.getProfile(userId);
            (0, response_1.sendSuccess)({
                res,
                message: "Profil berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            await userService.changePassword(userId, currentPassword, newPassword);
            (0, response_1.sendSuccess)({
                res,
                message: "Password berhasil diubah",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const { name, email } = req.body;
            const result = await userService.updateProfile(userId, { name, email });
            (0, response_1.sendSuccess)({
                res,
                message: "Profil berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const result = await authService.register(name, email, password, role);
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "Registrasi berhasil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);
            (0, response_1.sendSuccess)({
                res,
                message: "Jika email terdaftar, link reset password telah dikirim",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            await authService.resetPassword(token, password);
            (0, response_1.sendSuccess)({
                res,
                message: "Password berhasil direset",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadAvatar(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;
            if (!file) {
                throw new errors_1.BadRequestError("File avatar wajib diupload");
            }
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const result = await authService.uploadAvatar(userId, file.filename, baseUrl);
            (0, response_1.sendSuccess)({
                res,
                message: "Avatar berhasil diupload",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async googleAuth(req, res, next) {
        try {
            const { idToken } = req.body;
            const result = await authService.googleAuth(idToken);
            (0, response_1.sendSuccess)({
                res,
                message: "Autentikasi Google berhasil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
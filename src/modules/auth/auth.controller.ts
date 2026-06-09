import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { sendSuccess } from "../../shared/response";
import { BadRequestError } from "../../shared/errors";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      sendSuccess({
        res,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      sendSuccess({
        res,
        message: "Token berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess({
        res,
        message: "Logout berhasil",
      });
    } catch (error) {
      next(error);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.getProfile(userId);

      sendSuccess({
        res,
        message: "Profil berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(userId, currentPassword, newPassword);

      sendSuccess({
        res,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { name, email } = req.body;
      const result = await userService.updateProfile(userId, { name, email });

      sendSuccess({
        res,
        message: "Profil berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register(name, email, password, role);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Registrasi berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      sendSuccess({
        res,
        message: "Jika email terdaftar, link reset password telah dikirim",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);

      sendSuccess({
        res,
        message: "Password berhasil direset",
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const file = req.file;

      if (!file) {
        throw new BadRequestError("File avatar wajib diupload");
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const result = await authService.uploadAvatar(userId, file.filename, baseUrl);

      sendSuccess({
        res,
        message: "Avatar berhasil diupload",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;
      const result = await authService.googleAuth(idToken);

      sendSuccess({
        res,
        message: "Autentikasi Google berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

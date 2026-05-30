import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../shared/response";

const authService = new AuthService();

export class AuthController {
  /**
   * Handle user login request
   */
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

  /**
   * Handle access token refresh request
   */
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

  /**
   * Handle user logout request
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // For stateless JWTs, client simply discards the token.
      // Return a success response.
      sendSuccess({
        res,
        message: "Logout berhasil",
      });
    } catch (error) {
      next(error);
    }
  }
}

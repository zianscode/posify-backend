import { prisma } from "../../config/database";
import { UnauthorizedError } from "../../shared/errors";
import {
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  TokenPayload,
} from "../../shared/helpers";

export class AuthService {
  /**
   * Log in a user and issue a JWT access token and refresh token
   */
  async login(email: string, password: string) {
    // 1. Fetch user and their associated role
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    // 2. Verify hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password salah");
    }

    // 3. Build token payload
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      outletId: user.outletId,
    };

    // 4. Generate token pair
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // 5. Exclude password from returned user data
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validate a refresh token and issue a new set of tokens
   */
  async refreshToken(token: string) {
    try {
      // 1. Verify the refresh token
      const decoded = verifyToken(token);

      // 2. Fetch user to ensure they still exist and check their role
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedError("Pengguna tidak ditemukan");
      }

      // 3. Generate new token payload
      const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        outletId: user.outletId,
      };

      // 4. Generate new tokens
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Refresh token tidak valid atau kadaluarsa");
    }
  }
}

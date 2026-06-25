export declare class AuthService {
    login(email: string, password: string): Promise<{
        user: {
            role: {
                id: number;
                name: string;
            };
            id: number;
            name: string;
            email: string;
            roleId: number;
            outletId: number | null;
            avatar: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(name: string, email: string, password: string, roleName: string): Promise<{
        user: {
            role: {
                id: number;
                name: string;
            };
            id: number;
            name: string;
            email: string;
            roleId: number;
            outletId: number | null;
            avatar: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    googleAuth(idToken: string): Promise<{
        user: {
            role: {
                id: number;
                name: string;
            };
            id: number;
            name: string;
            email: string;
            roleId: number;
            outletId: number | null;
            avatar: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    uploadAvatar(userId: number, filename: string, baseUrl: string): Promise<{
        role: {
            id: number;
            name: string;
        };
        id: number;
        name: string;
        email: string;
        roleId: number;
        outletId: number | null;
        avatar: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map
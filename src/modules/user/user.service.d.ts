export declare class UserService {
    createUser(data: {
        name: string;
        email: string;
        password: string;
        roleId: number;
        outletId?: number | null;
    }): Promise<{
        role: {
            id: number;
            name: string;
        };
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
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
    getUsers(params: {
        page: number;
        limit: number;
        search?: string;
        roleId?: number;
        outletId?: number;
    }): Promise<{
        data: {
            role: {
                id: number;
                name: string;
            };
            outlet: {
                id: number;
                name: string;
                address: string | null;
                phone: string | null;
            } | null;
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
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUserById(id: number): Promise<{
        role: {
            id: number;
            name: string;
        };
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
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
    updateUser(id: number, data: {
        name?: string;
        email?: string;
        roleId?: number;
        outletId?: number | null;
    }): Promise<{
        role: {
            id: number;
            name: string;
        };
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
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
    deleteUser(id: number, currentUserId: number): Promise<void>;
    resetPassword(id: number, newPassword: string): Promise<void>;
    getProfile(userId: number): Promise<{
        role: {
            id: number;
            name: string;
        };
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
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
    updateProfile(userId: number, data: {
        name?: string;
        email?: string;
    }): Promise<{
        role: {
            id: number;
            name: string;
        };
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
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
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map
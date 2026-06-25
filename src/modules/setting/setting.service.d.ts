export declare class SettingService {
    createSetting(key: string, value: string, description?: string | null): Promise<{
        id: number;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
    }>;
    getSettings(): Promise<{
        id: number;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
    }[]>;
    getSettingById(id: number): Promise<{
        id: number;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
    }>;
    updateSetting(id: number, value: string, description?: string | null): Promise<{
        id: number;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
    }>;
    deleteSetting(id: number): Promise<{
        id: number;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
    }>;
}
//# sourceMappingURL=setting.service.d.ts.map
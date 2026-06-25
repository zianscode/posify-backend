import { PrismaClient } from "../generated/prisma";
declare global {
    var prisma: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import("../generated/prisma").Prisma.PrismaClientOptions, never, import("../generated/prisma/runtime/client").DefaultArgs>;
//# sourceMappingURL=database.d.ts.map
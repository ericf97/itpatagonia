export declare class Transfer {
    readonly id: string;
    readonly fromCompanyId: string;
    readonly toCompanyId: string;
    readonly amount: number;
    readonly description?: string | undefined;
    readonly createdAt: Date;
    constructor(id: string, fromCompanyId: string, toCompanyId: string, amount: number, description?: string | undefined, createdAt?: Date);
}

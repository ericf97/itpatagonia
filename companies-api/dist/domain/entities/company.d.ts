import { CompanyType } from '../enums/company-type.enum';
export declare class Company {
    readonly id: string;
    readonly name: string;
    readonly type: CompanyType;
    readonly description?: string | undefined;
    readonly createdAt: Date;
    constructor(id: string, name: string, type: CompanyType, description?: string | undefined, createdAt?: Date);
}

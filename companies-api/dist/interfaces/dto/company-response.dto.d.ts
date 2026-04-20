import { CompanyType } from '../../domain/enums/company-type.enum';
export declare class CompanyResponseDto {
    id: string;
    name: string;
    type: CompanyType;
    description?: string;
    createdAt: Date;
}

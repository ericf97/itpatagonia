import { CompanyType } from '../../domain/enums/company-type.enum';
export declare class CreateCompanyDto {
    name: string;
    description?: string;
    type: CompanyType;
}

import { Company } from '../../domain/entities/company';
import type { CompanyRepository } from '../../domain/repositories/company-repository';
import { CompanyType } from '../../domain/enums/company-type.enum';
export declare class CreateCompanyUseCase {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(name: string, description?: string, type?: CompanyType): Promise<Company>;
    private generateId;
}

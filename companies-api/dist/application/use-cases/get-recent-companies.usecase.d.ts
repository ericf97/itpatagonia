import { Company } from '../../domain/entities/company';
import type { CompanyRepository } from '../../domain/repositories/company-repository';
export declare class GetRecentCompaniesUseCase {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(): Promise<Company[]>;
}

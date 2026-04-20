import { Company } from '../../domain/entities/company';
import type { CompanyRepository } from '../../domain/repositories/company-repository';
import type { TransferRepository } from '../../domain/repositories/transfer-repository';
export declare class GetRecentTransfersUseCase {
    private readonly transferRepo;
    private readonly companyRepo;
    constructor(transferRepo: TransferRepository, companyRepo: CompanyRepository);
    execute(): Promise<Company[]>;
}

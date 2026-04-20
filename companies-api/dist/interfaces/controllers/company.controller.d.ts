import { CreateCompanyUseCase } from '../../application/use-cases/create-company.usecase';
import { GetRecentCompaniesUseCase } from '../../application/use-cases/get-recent-companies.usecase';
import { GetRecentTransfersUseCase } from '../../application/use-cases/get-recent-companies-transfer.usecase';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
export declare class CompanyController {
    private readonly createCompanyUseCase;
    private readonly getRecentCompaniesUseCase;
    private readonly getRecentTransfersUseCase;
    constructor(createCompanyUseCase: CreateCompanyUseCase, getRecentCompaniesUseCase: GetRecentCompaniesUseCase, getRecentTransfersUseCase: GetRecentTransfersUseCase);
    create(dto: CreateCompanyDto): Promise<CompanyResponseDto>;
    getRecent(): Promise<CompanyResponseDto[]>;
    getRecentTransfers(): Promise<import("../../domain/entities/company").Company[]>;
}

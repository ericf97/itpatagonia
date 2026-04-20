import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCompanyUseCase } from '../../application/use-cases/create-company.usecase';
import { GetRecentCompaniesUseCase } from '../../application/use-cases/get-recent-companies.usecase';
import { GetRecentTransfersUseCase } from '../../application/use-cases/get-recent-companies-transfer.usecase';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getRecentCompaniesUseCase: GetRecentCompaniesUseCase,
    private readonly getRecentTransfersUseCase: GetRecentTransfersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(@Body() dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.createCompanyUseCase.execute(dto.name, dto.description, dto.type);
    return {
      id: company.id,
      name: company.name,
      description: company.description,
      type: company.type,
      createdAt: company.createdAt,
    };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent companies' })
  @ApiResponse({
    status: 200,
    description: 'List of recent companies',
    type: [CompanyResponseDto],
  })
  async getRecent(): Promise<CompanyResponseDto[]> {
    const companies = await this.getRecentCompaniesUseCase.execute();
    return companies.map(company => ({
      id: company.id,
      name: company.name,
      type: company.type,
      description: company.description,
      createdAt: company.createdAt,
    }));
  }

  @Get('transfers/recent')
  @ApiOperation({ summary: 'Get recent transfers' })
  @ApiResponse({ status: 200, description: 'List of recent transfers' })
  async getRecentTransfers() {
    return this.getRecentTransfersUseCase.execute();
  }
}

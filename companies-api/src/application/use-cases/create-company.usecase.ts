import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company';
import type { CompanyRepository } from '../../domain/repositories/company-repository';
import { CompanyType } from '../../domain/enums/company-type.enum';

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(
    name: string,
    description?: string,
    type: CompanyType = CompanyType.PYME,
  ): Promise<Company> {
    const company = new Company(this.generateId(), name, type, description);
    await this.companyRepository.save(company);
    return company;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

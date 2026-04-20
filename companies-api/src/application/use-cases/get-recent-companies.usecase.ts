import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company';
import type { CompanyRepository } from '../../domain/repositories/company-repository';

@Injectable()
export class GetRecentCompaniesUseCase {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(): Promise<Company[]> {
    const since = new Date();
    since.setDate(1);
    since.setHours(0, 0, 0, 0);
    return this.companyRepository.findSince(since);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company';
import { Transfer } from '../../domain/entities/transfer';
import type { CompanyRepository } from '../../domain/repositories/company-repository';
import type { TransferRepository } from '../../domain/repositories/transfer-repository';

@Injectable()
export class GetRecentTransfersUseCase {
  constructor(
    @Inject('TransferRepository')
    private readonly transferRepo: TransferRepository,
    @Inject('CompanyRepository')
    private readonly companyRepo: CompanyRepository,
  ) {}

  async execute(): Promise<Company[]> {
    const since = new Date();
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const transfers: Transfer[] = await this.transferRepo.findSince(since);

    const companyIds = [...new Set(transfers.map((t) => t.fromCompanyId))];

    return this.companyRepo.findByIds(companyIds);
  }
}

import { Company } from '../entities/company';

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findByIds(ids: string[]): Promise<Company[]>;
  findSince(date: Date): Promise<Company[]>;
}

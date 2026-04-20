import { Model } from 'mongoose';
import { Company } from '../../domain/entities/company';
import { CompanyRepository } from '../../domain/repositories/company-repository';
import { CompanyDocument } from './schemas/company.schema';
export declare class MongoDbCompanyRepository implements CompanyRepository {
    private companyModel;
    constructor(companyModel: Model<CompanyDocument>);
    save(company: Company): Promise<void>;
    findByIds(ids: string[]): Promise<Company[]>;
    findSince(date: Date): Promise<Company[]>;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../domain/entities/company';
import { CompanyRepository } from '../../domain/repositories/company-repository';
import { CompanyDocument, CompanyModel } from './schemas/company.schema';

@Injectable()
export class MongoDbCompanyRepository implements CompanyRepository {
  constructor(
    @InjectModel(CompanyModel.name)
    private companyModel: Model<CompanyDocument>,
  ) {}

  async save(company: Company): Promise<void> {
    const companyDoc = new this.companyModel({
      id: company.id,
      name: company.name,
      type: company.type,
      description: company.description,
      createdAt: company.createdAt,
    });
    await companyDoc.save();
  }

  async findByIds(ids: string[]): Promise<Company[]> {
    const companyDocs = await this.companyModel
      .find({ id: { $in: ids } })
      .exec();
    return companyDocs.map(
      (doc) =>
        new Company(doc.id, doc.name, doc.type, doc.description, doc.createdAt),
    );
  }

  async findSince(date: Date): Promise<Company[]> {
    const companyDocs = await this.companyModel
      .find({ createdAt: { $gte: date } })
      .sort({ createdAt: -1 })
      .exec();
    return companyDocs.map(
      (doc) =>
        new Company(doc.id, doc.name, doc.type, doc.description, doc.createdAt),
    );
  }
}

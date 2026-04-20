import { CompanyType } from '../enums/company-type.enum';

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: CompanyType,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

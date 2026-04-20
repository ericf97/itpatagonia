export class Transfer {
  constructor(
    public readonly id: string,
    public readonly fromCompanyId: string,
    public readonly toCompanyId: string,
    public readonly amount: number,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

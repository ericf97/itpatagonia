import { Test, TestingModule } from '@nestjs/testing';
import { GetRecentTransfersUseCase } from '../../../src/application/use-cases/get-recent-companies-transfer.usecase';
import { CompanyRepository } from '../../../src/domain/repositories/company-repository';
import { TransferRepository } from '../../../src/domain/repositories/transfer-repository';
import { CompanyType } from '../../../src/domain/enums/company-type.enum';
import { Company } from '../../../src/domain/entities/company';
import { Transfer } from '../../../src/domain/entities/transfer';

describe('GetRecentTransfersUseCase', () => {
  let useCase: GetRecentTransfersUseCase;
  let mockTransferRepository: jest.Mocked<TransferRepository>;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    mockTransferRepository = {
      save: jest.fn(),
      findSince: jest.fn(),
    };

    mockCompanyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findRecent: jest.fn(),
      findByIds: jest.fn(),
      findSince: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRecentTransfersUseCase,
        { provide: 'TransferRepository', useValue: mockTransferRepository },
        { provide: 'CompanyRepository', useValue: mockCompanyRepository },
      ],
    }).compile();

    useCase = module.get<GetRecentTransfersUseCase>(GetRecentTransfersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return companies that made transfers in the last month', async () => {
      const transfers = [
        new Transfer('t1', 'comp1', 'comp2', 1000),
        new Transfer('t2', 'comp3', 'comp1', 2000),
      ];
      const companies = [
        new Company('comp1', 'Company 1', CompanyType.PYME),
        new Company('comp3', 'Company 3', CompanyType.CORPORATIVA),
      ];
      mockTransferRepository.findSince.mockResolvedValueOnce(transfers);
      mockCompanyRepository.findByIds.mockResolvedValueOnce(companies);

      const result = await useCase.execute();

      expect(result).toEqual(companies);
      expect(mockTransferRepository.findSince).toHaveBeenCalledTimes(1);
      expect(mockCompanyRepository.findByIds).toHaveBeenCalledWith(['comp1', 'comp3']);
    });

    it('should call findSince with a date approximately one month ago', async () => {
      mockTransferRepository.findSince.mockResolvedValueOnce([]);
      mockCompanyRepository.findByIds.mockResolvedValueOnce([]);

      await useCase.execute();

      const calledDate: Date = mockTransferRepository.findSince.mock.calls[0][0];
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      expect(calledDate.getTime()).toBe(startOfMonth.getTime());
    });

    it('should deduplicate company IDs from multiple transfers', async () => {
      const transfers = [
        new Transfer('t1', 'comp1', 'comp2', 500),
        new Transfer('t2', 'comp1', 'comp3', 1500),
        new Transfer('t3', 'comp2', 'comp1', 750),
      ];
      const companies = [
        new Company('comp1', 'Company 1', CompanyType.PYME),
        new Company('comp2', 'Company 2', CompanyType.CORPORATIVA),
      ];
      mockTransferRepository.findSince.mockResolvedValueOnce(transfers);
      mockCompanyRepository.findByIds.mockResolvedValueOnce(companies);

      await useCase.execute();

      const calledIds: string[] = mockCompanyRepository.findByIds.mock.calls[0][0];
      expect(calledIds).toHaveLength(2);
      expect(calledIds).toContain('comp1');
      expect(calledIds).toContain('comp2');
    });

    it('should return empty array when no transfers exist in the last month', async () => {
      mockTransferRepository.findSince.mockResolvedValueOnce([]);
      mockCompanyRepository.findByIds.mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockCompanyRepository.findByIds).toHaveBeenCalledWith([]);
    });

    it('should throw if transfer repository fails', async () => {
      mockTransferRepository.findSince.mockRejectedValueOnce(new Error('DB error'));

      await expect(useCase.execute()).rejects.toThrow('DB error');
    });

    it('should throw if company repository fails', async () => {
      mockTransferRepository.findSince.mockResolvedValueOnce([
        new Transfer('t1', 'comp1', 'comp2', 1000),
      ]);
      mockCompanyRepository.findByIds.mockRejectedValueOnce(new Error('DB error'));

      await expect(useCase.execute()).rejects.toThrow('DB error');
    });
  });
});

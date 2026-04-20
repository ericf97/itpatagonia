import { Test, TestingModule } from '@nestjs/testing';
import { GetRecentCompaniesUseCase } from '../../../src/application/use-cases/get-recent-companies.usecase';
import { CompanyRepository } from '../../../src/domain/repositories/company-repository';
import { CompanyType } from '../../../src/domain/enums/company-type.enum';
import { Company } from '../../../src/domain/entities/company';

describe('GetRecentCompaniesUseCase', () => {
  let useCase: GetRecentCompaniesUseCase;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    mockCompanyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByIds: jest.fn(),
      findSince: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRecentCompaniesUseCase,
        {
          provide: 'CompanyRepository',
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetRecentCompaniesUseCase>(GetRecentCompaniesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should call findSince with the start of the current month', async () => {
      mockCompanyRepository.findSince.mockResolvedValueOnce([]);

      await useCase.execute();

      const calledDate: Date = mockCompanyRepository.findSince.mock.calls[0][0];
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      expect(calledDate.getTime()).toBe(startOfMonth.getTime());
    });

    it('should return companies added in the current month', async () => {
      const mockCompanies = [
        new Company('1', 'Company 1', CompanyType.PYME),
        new Company('2', 'Company 2', CompanyType.CORPORATIVA),
      ];
      mockCompanyRepository.findSince.mockResolvedValueOnce(mockCompanies);

      const result = await useCase.execute();

      expect(result).toEqual(mockCompanies);
    });

    it('should return empty array when no companies were added this month', async () => {
      mockCompanyRepository.findSince.mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });

    it('should return companies sorted from newest to oldest', async () => {
      const newerCompany = new Company(
        '1',
        'Newest',
        CompanyType.PYME,
        undefined,
        new Date('2026-04-15'),
      );
      const olderCompany = new Company(
        '2',
        'Older',
        CompanyType.CORPORATIVA,
        undefined,
        new Date('2026-04-01'),
      );
      mockCompanyRepository.findSince.mockResolvedValueOnce([
        newerCompany,
        olderCompany,
      ]);

      const result = await useCase.execute();

      expect(result[0].name).toBe('Newest');
      expect(result[1].name).toBe('Older');
    });

    it('should throw if repository fails', async () => {
      mockCompanyRepository.findSince.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});

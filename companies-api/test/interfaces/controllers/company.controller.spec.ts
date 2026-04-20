import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../../../src/interfaces/controllers/company.controller';
import { CreateCompanyUseCase } from '../../../src/application/use-cases/create-company.usecase';
import { GetRecentCompaniesUseCase } from '../../../src/application/use-cases/get-recent-companies.usecase';
import { GetRecentTransfersUseCase } from '../../../src/application/use-cases/get-recent-companies-transfer.usecase';
import { CompanyType } from '../../../src/domain/enums/company-type.enum';
import { Company } from '../../../src/domain/entities/company';
import { CreateCompanyDto } from '../../../src/interfaces/dto/create-company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let mockCreateCompanyUseCase: jest.Mocked<CreateCompanyUseCase>;
  let mockGetRecentCompaniesUseCase: jest.Mocked<GetRecentCompaniesUseCase>;
  let mockGetRecentTransfersUseCase: jest.Mocked<GetRecentTransfersUseCase>;

  beforeEach(async () => {
    mockCreateCompanyUseCase = { execute: jest.fn() } as any;
    mockGetRecentCompaniesUseCase = { execute: jest.fn() } as any;
    mockGetRecentTransfersUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CreateCompanyUseCase, useValue: mockCreateCompanyUseCase },
        { provide: GetRecentCompaniesUseCase, useValue: mockGetRecentCompaniesUseCase },
        { provide: GetRecentTransfersUseCase, useValue: mockGetRecentTransfersUseCase },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a company with valid data', async () => {
      const createDto: CreateCompanyDto = {
        name: 'Tech Solutions',
        type: CompanyType.CORPORATIVA,
        description: 'A tech company',
      };
      const company = new Company('1', 'Tech Solutions', CompanyType.CORPORATIVA, 'A tech company');
      mockCreateCompanyUseCase.execute.mockResolvedValueOnce(company);

      const result = await controller.create(createDto);

      expect(result.id).toBe('1');
      expect(result.name).toBe('Tech Solutions');
      expect(result.type).toBe(CompanyType.CORPORATIVA);
      expect(result.description).toBe('A tech company');
      expect(mockCreateCompanyUseCase.execute).toHaveBeenCalledWith(
        'Tech Solutions',
        'A tech company',
        CompanyType.CORPORATIVA,
      );
    });

    it('should create a company without description', async () => {
      const createDto: CreateCompanyDto = { name: 'Simple Company', type: CompanyType.PYME };
      const company = new Company('2', 'Simple Company', CompanyType.PYME);
      mockCreateCompanyUseCase.execute.mockResolvedValueOnce(company);

      const result = await controller.create(createDto);

      expect(result.description).toBeUndefined();
      expect(mockCreateCompanyUseCase.execute).toHaveBeenCalledWith(
        'Simple Company',
        undefined,
        CompanyType.PYME,
      );
    });

    it('should map company entity to response DTO', async () => {
      const createDto: CreateCompanyDto = { name: 'New Company', type: CompanyType.PYME };
      mockCreateCompanyUseCase.execute.mockResolvedValueOnce(
        new Company('3', 'New Company', CompanyType.PYME),
      );

      const result = await controller.create(createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('createdAt');
    });

    it('should throw if use case fails', async () => {
      mockCreateCompanyUseCase.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        controller.create({ name: 'X', type: CompanyType.PYME }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getRecent', () => {
    it('should return companies added in the last month', async () => {
      const companies = [
        new Company('1', 'Company 1', CompanyType.PYME),
        new Company('2', 'Company 2', CompanyType.CORPORATIVA),
      ];
      mockGetRecentCompaniesUseCase.execute.mockResolvedValueOnce(companies);

      const result = await controller.getRecent();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Company 1');
      expect(result[1].name).toBe('Company 2');
      expect(mockGetRecentCompaniesUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no companies were added in the last month', async () => {
      mockGetRecentCompaniesUseCase.execute.mockResolvedValueOnce([]);

      const result = await controller.getRecent();

      expect(result).toEqual([]);
    });

    it('should map company entities to response DTOs', async () => {
      mockGetRecentCompaniesUseCase.execute.mockResolvedValueOnce([
        new Company('1', 'Company 1', CompanyType.PYME, 'Description 1'),
      ]);

      const result = await controller.getRecent();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('createdAt');
    });

    it('should throw if use case fails', async () => {
      mockGetRecentCompaniesUseCase.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.getRecent()).rejects.toThrow('Database error');
    });
  });

  describe('getRecentTransfers', () => {
    it('should return companies that made transfers in the last month', async () => {
      const companies = [
        new Company('1', 'Company 1', CompanyType.PYME),
        new Company('2', 'Company 2', CompanyType.CORPORATIVA),
      ];
      mockGetRecentTransfersUseCase.execute.mockResolvedValueOnce(companies);

      const result = await controller.getRecentTransfers();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Company 1');
      expect(result[1].name).toBe('Company 2');
      expect(mockGetRecentTransfersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no transfers in the last month', async () => {
      mockGetRecentTransfersUseCase.execute.mockResolvedValueOnce([]);

      const result = await controller.getRecentTransfers();

      expect(result).toEqual([]);
    });

    it('should throw if use case fails', async () => {
      mockGetRecentTransfersUseCase.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.getRecentTransfers()).rejects.toThrow('Database error');
    });
  });
});

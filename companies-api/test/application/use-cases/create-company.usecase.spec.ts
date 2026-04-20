import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompanyUseCase } from '../../../src/application/use-cases/create-company.usecase';
import { CompanyRepository } from '../../../src/domain/repositories/company-repository';
import { CompanyType } from '../../../src/domain/enums/company-type.enum';
import { Company } from '../../../src/domain/entities/company';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    // Create mock repository
    mockCompanyRepository = {
      save: jest.fn(),
      findByIds: jest.fn(),
      findSince: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCompanyUseCase,
        {
          provide: 'CompanyRepository',
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a company with all parameters', async () => {
      // Arrange
      const name = 'Tech Solutions';
      const description = 'A tech company';
      const type = CompanyType.CORPORATIVA;

      // Act
      const result = await useCase.execute(name, description, type);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe(name);
      expect(result.description).toBe(description);
      expect(result.type).toBe(type);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(expect.any(Company));
    });

    it('should create a company with default type (PYME) when not provided', async () => {
      // Arrange
      const name = 'Startup Company';
      const description = 'A startup';

      // Act
      const result = await useCase.execute(name, description);

      // Assert
      expect(result.type).toBe(CompanyType.PYME);
      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create a company without description', async () => {
      // Arrange
      const name = 'Simple Company';
      const type = CompanyType.PYME;

      // Act
      const result = await useCase.execute(name, undefined, type);

      // Assert
      expect(result.name).toBe(name);
      expect(result.description).toBeUndefined();
      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should save the company to the repository', async () => {
      // Arrange
      const name = 'Repository Test';

      // Act
      await useCase.execute(name);

      // Assert
      expect(mockCompanyRepository.save).toHaveBeenCalled();
      const savedCompany = mockCompanyRepository.save.mock.calls[0][0];
      expect(savedCompany).toBeInstanceOf(Company);
      expect(savedCompany.name).toBe(name);
    });

    it('should generate a unique ID for each company', async () => {
      // Act
      const company1 = await useCase.execute('Company 1');
      const company2 = await useCase.execute('Company 2');

      // Assert
      expect(company1.id).not.toBe(company2.id);
    });

    it('should throw an error if repository.save fails', async () => {
      // Arrange
      mockCompanyRepository.save.mockRejectedValueOnce(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(useCase.execute('Company')).rejects.toThrow('Database error');
    });
  });
});

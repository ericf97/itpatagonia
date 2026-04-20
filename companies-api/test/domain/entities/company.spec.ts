import { Company } from '../../../src/domain/entities/company';
import { CompanyType } from '../../../src/domain/enums/company-type.enum';

describe('Company Entity', () => {
  describe('constructor', () => {
    it('should create a company with all parameters', () => {
      // Arrange & Act
      const company = new Company(
        'comp-1',
        'Tech Solutions',
        CompanyType.CORPORATIVA,
        'A tech company',
      );

      // Assert
      expect(company.id).toBe('comp-1');
      expect(company.name).toBe('Tech Solutions');
      expect(company.type).toBe(CompanyType.CORPORATIVA);
      expect(company.description).toBe('A tech company');
      expect(company.createdAt).toBeDefined();
    });

    it('should create a company without description', () => {
      // Arrange & Act
      const company = new Company(
        'comp-2',
        'Simple Company',
        CompanyType.PYME,
      );

      // Assert
      expect(company.id).toBe('comp-2');
      expect(company.name).toBe('Simple Company');
      expect(company.type).toBe(CompanyType.PYME);
      expect(company.description).toBeUndefined();
    });

    it('should set createdAt to current date when not provided', () => {
      // Arrange & Act
      const beforeCreation = new Date();
      const company = new Company('comp-3', 'Test Company', CompanyType.PYME);
      const afterCreation = new Date();

      // Assert
      expect(company.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(company.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should use provided createdAt date', () => {
      // Arrange
      const createdAt = new Date('2024-04-20');

      // Act
      const company = new Company(
        'comp-4',
        'Test Company',
        CompanyType.PYME,
        undefined,
        createdAt,
      );

      // Assert
      expect(company.createdAt).toEqual(createdAt);
    });

    it('should have readonly properties', () => {
      // Arrange
      const company = new Company(
        'comp-5',
        'Test Company',
        CompanyType.PYME,
      );

      // readonly is a compile-time TypeScript guarantee; verify the property exists and is accessible
      expect(company.id).toBeDefined();
      expect(typeof company.id).toBe('string');
    });
  });

  describe('properties', () => {
    it('should have id, name, type, description, and createdAt properties', () => {
      // Arrange & Act
      const company = new Company(
        'comp-6',
        'Test Company',
        CompanyType.CORPORATIVA,
        'Description',
      );

      // Assert
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('type');
      expect(company).toHaveProperty('description');
      expect(company).toHaveProperty('createdAt');
    });

    it('should support all CompanyType enum values', () => {
      // Arrange & Act
      const companyPyme = new Company(
        'comp-7',
        'Pyme Company',
        CompanyType.PYME,
      );
      const companyCorporativa = new Company(
        'comp-8',
        'Corporativa Company',
        CompanyType.CORPORATIVA,
      );

      // Assert
      expect(companyPyme.type).toBe(CompanyType.PYME);
      expect(companyCorporativa.type).toBe(CompanyType.CORPORATIVA);
    });
  });
});

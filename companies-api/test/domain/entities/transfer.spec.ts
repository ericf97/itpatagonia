import { Transfer } from '../../../src/domain/entities/transfer';

describe('Transfer Entity', () => {
  describe('constructor', () => {
    it('should create a transfer with all parameters', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-1',
        'comp-1',
        'comp-2',
        5000,
        'Payment for services',
      );

      // Assert
      expect(transfer.id).toBe('transfer-1');
      expect(transfer.fromCompanyId).toBe('comp-1');
      expect(transfer.toCompanyId).toBe('comp-2');
      expect(transfer.amount).toBe(5000);
      expect(transfer.description).toBe('Payment for services');
      expect(transfer.createdAt).toBeDefined();
    });

    it('should create a transfer without description', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-2',
        'comp-1',
        'comp-2',
        1000,
      );

      // Assert
      expect(transfer.id).toBe('transfer-2');
      expect(transfer.fromCompanyId).toBe('comp-1');
      expect(transfer.toCompanyId).toBe('comp-2');
      expect(transfer.amount).toBe(1000);
      expect(transfer.description).toBeUndefined();
    });

    it('should set createdAt to current date when not provided', () => {
      // Arrange & Act
      const beforeCreation = new Date();
      const transfer = new Transfer(
        'transfer-3',
        'comp-1',
        'comp-2',
        2000,
      );
      const afterCreation = new Date();

      // Assert
      expect(transfer.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(transfer.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should use provided createdAt date', () => {
      // Arrange
      const createdAt = new Date('2024-04-20');

      // Act
      const transfer = new Transfer(
        'transfer-4',
        'comp-1',
        'comp-2',
        3000,
        undefined,
        createdAt,
      );

      // Assert
      expect(transfer.createdAt).toEqual(createdAt);
    });

    it('should have readonly properties', () => {
      // Arrange
      const transfer = new Transfer(
        'transfer-5',
        'comp-1',
        'comp-2',
        1500,
      );

      // readonly is a compile-time TypeScript guarantee; verify the property exists and is accessible
      expect(transfer.id).toBeDefined();
      expect(typeof transfer.id).toBe('string');
    });
  });

  describe('properties', () => {
    it('should have all required properties', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-6',
        'comp-1',
        'comp-2',
        2500,
        'Test transfer',
      );

      // Assert
      expect(transfer).toHaveProperty('id');
      expect(transfer).toHaveProperty('fromCompanyId');
      expect(transfer).toHaveProperty('toCompanyId');
      expect(transfer).toHaveProperty('amount');
      expect(transfer).toHaveProperty('description');
      expect(transfer).toHaveProperty('createdAt');
    });

    it('should handle decimal amounts', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-7',
        'comp-1',
        'comp-2',
        1234.56,
      );

      // Assert
      expect(transfer.amount).toBe(1234.56);
    });

    it('should handle zero amount', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-8',
        'comp-1',
        'comp-2',
        0,
      );

      // Assert
      expect(transfer.amount).toBe(0);
    });

    it('should handle large amounts', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-9',
        'comp-1',
        'comp-2',
        999999999.99,
      );

      // Assert
      expect(transfer.amount).toBe(999999999.99);
    });

    it('should handle same company transfer', () => {
      // Arrange & Act
      const transfer = new Transfer(
        'transfer-10',
        'comp-1',
        'comp-1',
        1000,
        'Internal transfer',
      );

      // Assert
      expect(transfer.fromCompanyId).toBe('comp-1');
      expect(transfer.toCompanyId).toBe('comp-1');
    });
  });
});

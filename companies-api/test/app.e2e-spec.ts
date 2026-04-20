import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from './../src/app.module';
import { CompanyModel } from './../src/infrastructure/persistence/schemas/company.schema';
import { TransferModel } from './../src/infrastructure/persistence/schemas/transfer.schema';

describe('CompanyController (e2e)', () => {
  let app: INestApplication<App>;
  let mockCompanyModel: any;
  let mockTransferModel: any;

  beforeEach(async () => {
    mockCompanyModel = {
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    mockTransferModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(CompanyModel.name))
      .useValue(mockCompanyModel)
      .overrideProvider(getModelToken(TransferModel.name))
      .useValue(mockTransferModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /companies', () => {
    it('should create a company and return 201', async () => {
      const saveMock = jest.fn().mockResolvedValue({});
      mockCompanyModel.save = saveMock;

      return request(app.getHttpServer())
        .post('/companies')
        .send({ name: 'Test Company', type: 'Pyme' })
        .expect(201)
        .expect(res => {
          expect(res.body.name).toBe('Test Company');
          expect(res.body.type).toBe('Pyme');
          expect(res.body.id).toBeDefined();
        });
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/companies')
        .send({})
        .expect(400);
    });
  });

  describe('GET /companies/recent', () => {
    it('should return 200 with an array', () => {
      mockCompanyModel.exec.mockResolvedValueOnce([]);

      return request(app.getHttpServer())
        .get('/companies/recent')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /companies/transfers/recent', () => {
    it('should return 200 with an array', () => {
      mockTransferModel.exec.mockResolvedValueOnce([]);

      return request(app.getHttpServer())
        .get('/companies/transfers/recent')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});

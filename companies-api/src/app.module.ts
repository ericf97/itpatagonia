import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controllers
import { CompanyController } from './interfaces/controllers/company.controller';

// Use Cases
import { CreateCompanyUseCase } from './application/use-cases/create-company.usecase';
import { GetRecentCompaniesUseCase } from './application/use-cases/get-recent-companies.usecase';
import { GetRecentTransfersUseCase } from './application/use-cases/get-recent-companies-transfer.usecase';

// Infrastructure
import { DatabaseModule } from './infrastructure/database/database.module';
import { MongoDbCompanyRepository } from './infrastructure/persistence/mongodb-company.repository';
import { MongoDbTransferRepository } from './infrastructure/persistence/mongodb-transfer.repository';
import {
  CompanySchema,
  CompanyModel,
} from './infrastructure/persistence/schemas/company.schema';
import {
  TransferSchema,
  TransferModel,
} from './infrastructure/persistence/schemas/transfer.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: CompanyModel.name, schema: CompanySchema },
      { name: TransferModel.name, schema: TransferSchema },
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    // Use Cases
    CreateCompanyUseCase,
    GetRecentCompaniesUseCase,
    GetRecentTransfersUseCase,

    // Repository binding
    {
      provide: 'CompanyRepository',
      useClass: MongoDbCompanyRepository,
    },
    {
      provide: 'TransferRepository',
      useClass: MongoDbTransferRepository,
    },
  ],
})
export class AppModule {}

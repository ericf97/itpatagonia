"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const company_controller_1 = require("./interfaces/controllers/company.controller");
const create_company_usecase_1 = require("./application/use-cases/create-company.usecase");
const get_recent_companies_usecase_1 = require("./application/use-cases/get-recent-companies.usecase");
const get_recent_companies_transfer_usecase_1 = require("./application/use-cases/get-recent-companies-transfer.usecase");
const database_module_1 = require("./infrastructure/database/database.module");
const mongodb_company_repository_1 = require("./infrastructure/persistence/mongodb-company.repository");
const mongodb_transfer_repository_1 = require("./infrastructure/persistence/mongodb-transfer.repository");
const company_schema_1 = require("./infrastructure/persistence/schemas/company.schema");
const transfer_schema_1 = require("./infrastructure/persistence/schemas/transfer.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([
                { name: company_schema_1.CompanyModel.name, schema: company_schema_1.CompanySchema },
                { name: transfer_schema_1.TransferModel.name, schema: transfer_schema_1.TransferSchema },
            ]),
        ],
        controllers: [company_controller_1.CompanyController],
        providers: [
            create_company_usecase_1.CreateCompanyUseCase,
            get_recent_companies_usecase_1.GetRecentCompaniesUseCase,
            get_recent_companies_transfer_usecase_1.GetRecentTransfersUseCase,
            {
                provide: 'CompanyRepository',
                useClass: mongodb_company_repository_1.MongoDbCompanyRepository,
            },
            {
                provide: 'TransferRepository',
                useClass: mongodb_transfer_repository_1.MongoDbTransferRepository,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
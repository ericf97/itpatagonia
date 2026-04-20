"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_company_usecase_1 = require("../../application/use-cases/create-company.usecase");
const get_recent_companies_usecase_1 = require("../../application/use-cases/get-recent-companies.usecase");
const get_recent_companies_transfer_usecase_1 = require("../../application/use-cases/get-recent-companies-transfer.usecase");
const create_company_dto_1 = require("../dto/create-company.dto");
const company_response_dto_1 = require("../dto/company-response.dto");
let CompanyController = class CompanyController {
    createCompanyUseCase;
    getRecentCompaniesUseCase;
    getRecentTransfersUseCase;
    constructor(createCompanyUseCase, getRecentCompaniesUseCase, getRecentTransfersUseCase) {
        this.createCompanyUseCase = createCompanyUseCase;
        this.getRecentCompaniesUseCase = getRecentCompaniesUseCase;
        this.getRecentTransfersUseCase = getRecentTransfersUseCase;
    }
    async create(dto) {
        const company = await this.createCompanyUseCase.execute(dto.name, dto.description, dto.type);
        return {
            id: company.id,
            name: company.name,
            description: company.description,
            type: company.type,
            createdAt: company.createdAt,
        };
    }
    async getRecent() {
        const companies = await this.getRecentCompaniesUseCase.execute();
        return companies.map(company => ({
            id: company.id,
            name: company.name,
            type: company.type,
            description: company.description,
            createdAt: company.createdAt,
        }));
    }
    async getRecentTransfers() {
        return this.getRecentTransfersUseCase.execute();
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The company has been successfully created.',
        type: company_response_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent companies' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of recent companies',
        type: [company_response_dto_1.CompanyResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('transfers/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent transfers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of recent transfers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getRecentTransfers", null);
exports.CompanyController = CompanyController = __decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [create_company_usecase_1.CreateCompanyUseCase,
        get_recent_companies_usecase_1.GetRecentCompaniesUseCase,
        get_recent_companies_transfer_usecase_1.GetRecentTransfersUseCase])
], CompanyController);
//# sourceMappingURL=company.controller.js.map
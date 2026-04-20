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
exports.MongoDbCompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_1 = require("../../domain/entities/company");
const company_schema_1 = require("./schemas/company.schema");
let MongoDbCompanyRepository = class MongoDbCompanyRepository {
    companyModel;
    constructor(companyModel) {
        this.companyModel = companyModel;
    }
    async save(company) {
        const companyDoc = new this.companyModel({
            id: company.id,
            name: company.name,
            type: company.type,
            description: company.description,
            createdAt: company.createdAt,
        });
        await companyDoc.save();
    }
    async findByIds(ids) {
        const companyDocs = await this.companyModel
            .find({ id: { $in: ids } })
            .exec();
        return companyDocs.map((doc) => new company_1.Company(doc.id, doc.name, doc.type, doc.description, doc.createdAt));
    }
    async findSince(date) {
        const companyDocs = await this.companyModel
            .find({ createdAt: { $gte: date } })
            .sort({ createdAt: -1 })
            .exec();
        return companyDocs.map((doc) => new company_1.Company(doc.id, doc.name, doc.type, doc.description, doc.createdAt));
    }
};
exports.MongoDbCompanyRepository = MongoDbCompanyRepository;
exports.MongoDbCompanyRepository = MongoDbCompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.CompanyModel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoDbCompanyRepository);
//# sourceMappingURL=mongodb-company.repository.js.map
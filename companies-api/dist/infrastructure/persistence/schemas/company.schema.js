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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySchema = exports.CompanyModel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const company_type_enum_1 = require("../../../domain/enums/company-type.enum");
let CompanyModel = class CompanyModel {
    id;
    name;
    type;
    description;
    createdAt;
};
exports.CompanyModel = CompanyModel;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyModel.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyModel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: company_type_enum_1.CompanyType }),
    __metadata("design:type", String)
], CompanyModel.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyModel.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], CompanyModel.prototype, "createdAt", void 0);
exports.CompanyModel = CompanyModel = __decorate([
    (0, mongoose_1.Schema)()
], CompanyModel);
exports.CompanySchema = mongoose_1.SchemaFactory.createForClass(CompanyModel);
//# sourceMappingURL=company.schema.js.map
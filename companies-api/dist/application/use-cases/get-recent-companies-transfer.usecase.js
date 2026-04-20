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
exports.GetRecentTransfersUseCase = void 0;
const common_1 = require("@nestjs/common");
let GetRecentTransfersUseCase = class GetRecentTransfersUseCase {
    transferRepo;
    companyRepo;
    constructor(transferRepo, companyRepo) {
        this.transferRepo = transferRepo;
        this.companyRepo = companyRepo;
    }
    async execute() {
        const since = new Date();
        since.setDate(1);
        since.setHours(0, 0, 0, 0);
        const transfers = await this.transferRepo.findSince(since);
        const companyIds = [...new Set(transfers.map((t) => t.fromCompanyId))];
        return this.companyRepo.findByIds(companyIds);
    }
};
exports.GetRecentTransfersUseCase = GetRecentTransfersUseCase;
exports.GetRecentTransfersUseCase = GetRecentTransfersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('TransferRepository')),
    __param(1, (0, common_1.Inject)('CompanyRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetRecentTransfersUseCase);
//# sourceMappingURL=get-recent-companies-transfer.usecase.js.map
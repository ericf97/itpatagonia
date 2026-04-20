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
exports.MongoDbTransferRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transfer_1 = require("../../domain/entities/transfer");
const transfer_schema_1 = require("./schemas/transfer.schema");
let MongoDbTransferRepository = class MongoDbTransferRepository {
    transferModel;
    constructor(transferModel) {
        this.transferModel = transferModel;
    }
    async save(transfer) {
        const transferDoc = new this.transferModel({
            id: transfer.id,
            fromCompanyId: transfer.fromCompanyId,
            toCompanyId: transfer.toCompanyId,
            amount: transfer.amount,
            description: transfer.description,
            createdAt: transfer.createdAt,
        });
        await transferDoc.save();
    }
    async findSince(date) {
        const transferDocs = await this.transferModel
            .find({ createdAt: { $gte: date } })
            .sort({ createdAt: -1 })
            .exec();
        return transferDocs.map(doc => new transfer_1.Transfer(doc.id, doc.fromCompanyId, doc.toCompanyId, doc.amount, doc.description, doc.createdAt));
    }
};
exports.MongoDbTransferRepository = MongoDbTransferRepository;
exports.MongoDbTransferRepository = MongoDbTransferRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transfer_schema_1.TransferModel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoDbTransferRepository);
//# sourceMappingURL=mongodb-transfer.repository.js.map
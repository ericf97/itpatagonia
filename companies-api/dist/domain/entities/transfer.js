"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
class Transfer {
    id;
    fromCompanyId;
    toCompanyId;
    amount;
    description;
    createdAt;
    constructor(id, fromCompanyId, toCompanyId, amount, description, createdAt = new Date()) {
        this.id = id;
        this.fromCompanyId = fromCompanyId;
        this.toCompanyId = toCompanyId;
        this.amount = amount;
        this.description = description;
        this.createdAt = createdAt;
    }
}
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.js.map
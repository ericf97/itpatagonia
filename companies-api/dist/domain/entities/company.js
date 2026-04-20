"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
class Company {
    id;
    name;
    type;
    description;
    createdAt;
    constructor(id, name, type, description, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.createdAt = createdAt;
    }
}
exports.Company = Company;
//# sourceMappingURL=company.js.map
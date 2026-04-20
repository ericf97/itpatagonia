import { Document } from 'mongoose';
import { CompanyType } from '../../../domain/enums/company-type.enum';
export type CompanyDocument = CompanyModel & Document;
export declare class CompanyModel {
    id: string;
    name: string;
    type: CompanyType;
    description?: string;
    createdAt: Date;
}
export declare const CompanySchema: import("mongoose").Schema<CompanyModel, import("mongoose").Model<CompanyModel, any, any, any, Document<unknown, any, CompanyModel, any, {}> & CompanyModel & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyModel, Document<unknown, {}, import("mongoose").FlatRecord<CompanyModel>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<CompanyModel> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

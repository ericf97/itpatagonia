import { Document } from 'mongoose';
export type TransferDocument = TransferModel & Document;
export declare class TransferModel {
    id: string;
    fromCompanyId: string;
    toCompanyId: string;
    amount: number;
    description?: string;
    createdAt: Date;
}
export declare const TransferSchema: import("mongoose").Schema<TransferModel, import("mongoose").Model<TransferModel, any, any, any, Document<unknown, any, TransferModel, any, {}> & TransferModel & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TransferModel, Document<unknown, {}, import("mongoose").FlatRecord<TransferModel>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TransferModel> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

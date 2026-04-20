import { Model } from 'mongoose';
import { Transfer } from '../../domain/entities/transfer';
import { TransferRepository } from '../../domain/repositories/transfer-repository';
import { TransferDocument } from './schemas/transfer.schema';
export declare class MongoDbTransferRepository implements TransferRepository {
    private readonly transferModel;
    constructor(transferModel: Model<TransferDocument>);
    save(transfer: Transfer): Promise<void>;
    findSince(date: Date): Promise<Transfer[]>;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from '../../domain/entities/transfer';
import { TransferRepository } from '../../domain/repositories/transfer-repository';
import { TransferDocument, TransferModel } from './schemas/transfer.schema';

@Injectable()
export class MongoDbTransferRepository implements TransferRepository {
  constructor(
    @InjectModel(TransferModel.name)
    private readonly transferModel: Model<TransferDocument>,
  ) {}

  async save(transfer: Transfer): Promise<void> {
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

  async findSince(date: Date): Promise<Transfer[]> {
    const transferDocs = await this.transferModel
      .find({ createdAt: { $gte: date } })
      .sort({ createdAt: -1 })
      .exec();

    return transferDocs.map(
      doc =>
        new Transfer(
          doc.id,
          doc.fromCompanyId,
          doc.toCompanyId,
          doc.amount,
          doc.description,
          doc.createdAt,
        ),
    );
  }
}

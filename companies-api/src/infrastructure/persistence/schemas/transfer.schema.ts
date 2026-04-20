import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransferDocument = TransferModel & Document;

@Schema()
export class TransferModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  fromCompanyId: string;

  @Prop({ required: true })
  toCompanyId: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransferSchema = SchemaFactory.createForClass(TransferModel);

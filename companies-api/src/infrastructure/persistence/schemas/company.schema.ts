import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CompanyType } from '../../../domain/enums/company-type.enum';

export type CompanyDocument = CompanyModel & Document;

@Schema()
export class CompanyModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: CompanyType })
  type: CompanyType;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyModel);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Date, immutable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

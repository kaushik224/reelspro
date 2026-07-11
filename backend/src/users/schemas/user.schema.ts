import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  const user = this as any;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

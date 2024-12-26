import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  "_id": string,
  "name": string,
  "email": string,
  "mobileNumber": string,
  "password": string,
  "birth_date": Date;
  "gender": string,
  "role": string
  "createdBy": string;
  "updatedBy": string;
  "isActive": boolean;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birth_date: { type: Date },
  gender: { type: String },
  role: { type: String, required: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true
});

const UserModel = mongoose.model<IUser>('User', userSchema);
export { UserModel }
import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  "_id": string,
  "userId": string,
  "grammy": string,
  "isActive": boolean;
  "createdBy": string;
  "updatedBy": string;
}

const artistSchema = new Schema({
  userId: { type: String, required: true },
  grammy: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String },
}, {
  timestamps: true
});

const ArtistModel = mongoose.model<IArtist>('Artist', artistSchema);
export { ArtistModel }
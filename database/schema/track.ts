import mongoose, { Schema, Document } from 'mongoose';

export interface ITrack extends Document {
  _id: string;
  albumId: string;
  name: string;
  duration: number; // Duration in minutes
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

const trackSchema = new Schema(
  {
    albumId: { type: String, required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

const TrackModel = mongoose.model<ITrack>('Track', trackSchema);
export { TrackModel };

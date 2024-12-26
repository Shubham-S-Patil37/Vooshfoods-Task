import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  _id: string;
  artistId: string;
  description: string
  title: string;
  genre: string;
  releaseAt: number; // release year
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

const albumSchema = new Schema<IAlbum>(
  {
    artistId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    genre: { type: String, required: true },
    releaseAt: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, },
  },
  {
    timestamps: true,
  }
);

const AlbumModel = mongoose.model<IAlbum>('Album', albumSchema);

export { AlbumModel };

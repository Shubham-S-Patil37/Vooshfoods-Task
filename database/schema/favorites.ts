import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  _id: string;
  userId: string;
  categoryId: string;
  category: string;
  isActive: boolean;
}

const favoriteSchema = new Schema(
  {
    userId: { type: String, required: true },
    categoryId: { type: String, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);
export { FavoriteModel };

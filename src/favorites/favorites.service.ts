import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FavoriteModel, IFavorite } from 'database/schema/favorites';
import { IUser } from 'database/schema/user';
import { UserService } from 'src/user/user.service';
import { FavoriteDTO } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private userService: UserService) { }

  async getFavoriteCategory(userId: string, category: string) {

    try {
      const user: IUser = await this.userService.checkUser(userId, "User")
      const favorite: IFavorite[] = await FavoriteModel.find({ "userId": userId, "category": category })
    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async addFavorite(userId: string, favoriteInfo: FavoriteDTO) {
    try {
      const user: IUser = await this.userService.checkUser(userId, "User")
      const favorite = new FavoriteModel(favoriteInfo)
      favorite.userId = userId
      favorite.isActive = true
      favorite.save();
    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async deleteFavorite(userId: string, favoriteId: string) {

    try {
      const user: IUser = await this.userService.checkUser(userId, "User")

      const favorite: IFavorite = await FavoriteModel.findOne({ "_id": favoriteId, isActive: false })

      if (!favorite) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: `favorite not found`, },
          HttpStatus.NOT_FOUND,
        );
      }

      if (favorite.userId != userId)
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Your are not authorize to delete', },
          HttpStatus.FORBIDDEN,
        );

      return { "data": {}, "message": "favorite deleted successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }
}

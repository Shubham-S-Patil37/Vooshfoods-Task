import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FavoriteModel, IFavorite } from 'database/schema/favorites';
import { IUser } from 'database/schema/user';
import { UserService } from 'src/user/user.service';

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
}

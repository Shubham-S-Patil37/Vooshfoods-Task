import { Injectable } from '@nestjs/common';
import { FavoriteModel, IFavorite } from 'database/schema/favorites';
import { IUser } from 'database/schema/user';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FavoritesService {
  constructor(private userService: UserService) { }

  async getFavoriteCategory(userId: string, category: string) {

    const user: IUser = await this.userService.checkUser(userId, "User")

    const favorite: IFavorite[] = await FavoriteModel.find({ "userId": userId, "category": category })




  }
}

import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { FavoriteDTO } from './dto/favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:category')
  async getFavorite(@Req() req: any, @Param('category') category: string) {
    const userId = req.user?.userId
    return await this.favoritesService.getFavoriteCategory(userId, category)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createFavorite(@Req() req: any, @Body() favoriteDetails: FavoriteDTO) {
    const userId = req.user?.userId
    return await this.favoritesService.addFavorite(userId, favoriteDetails)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:favoriteId')
  async deleteFavorite(@Req() req: any, @Param('favoriteId') favoriteId: string) {
    const userId = req.user?.userId
    return await this.favoritesService.deleteFavorite(userId, favoriteId)
  }
}

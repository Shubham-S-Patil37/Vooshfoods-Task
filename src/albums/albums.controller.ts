import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAlbumDTO } from './dto/createAlbum.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Get('/:skip/:limit')
  async getAllAlbums(@Req() req: any, @Param('skip') skip: string, @Param('limit') limit: string) {
    return await this.albumsService.getAllAlbums(skip, limit)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:albumId')
  async getAlbums(@Req() req: any, @Param('albumId') albumId: string) {
    const userId = req.user?.userId
    return await this.albumsService.getAlbum(albumId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createAlbum(@Req() req: any, @Body() userDetails: CreateAlbumDTO) {
    const userId = req.user?.userId
    return await this.albumsService.createAlbum(userDetails, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:albumId')
  async updateAlbum(@Req() req: any, @Body() userDetails: CreateAlbumDTO, @Param('albumId') albumId: string) {
    const userId = req.user?.userId
    return await this.albumsService.updateAlbum(userDetails, userId, albumId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:albumId')
  async deleteAlbum(@Req() req: any, @Param('albumId') albumId: string) {
    const userId = req.user?.userId
    return await this.albumsService.deleteAlbum(userId, albumId)
  }

}

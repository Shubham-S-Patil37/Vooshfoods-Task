import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArtistsService } from './artists.service';
import { CreateArtistsDTO } from './dto/createArtist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) { }

  @Get('/:skip/:limit')
  async getAllArtist(@Req() req: any, @Param('skip') skip: string, @Param('limit') limit: string) {
    const userId = req.user?.userId
    return await this.artistsService.getAllArtist(skip, limit, userId)
  }

  // Only admin and Editor can add new Artists
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async addArtists(@Req() req: any, @Body() userDetails: CreateArtistsDTO) {
    const userId = req.user?.userId
    return await this.artistsService.createArtist(userDetails, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getArtist(@Req() req: any) {
    const userId = req.user?.userId
    return await this.artistsService.getArtist(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/')
  async updateArtist(@Req() req: any, @Body() userDetails: CreateArtistsDTO) {
    const userId = req.user?.userId
    return await this.artistsService.updateArtist(userDetails, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:artistId')
  async deleteArtist(@Req() req: any, @Param('artistId') artistId) {
    const userId = req.user?.userId
    return await this.artistsService.deleteArtist(userId, artistId)
  }

}

import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrackDTO } from './dto/createTrack.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) { }

  @Get('/:skip/:limit')
  async getAllTrack(@Param('skip') skip: string, @Param('limit') limit: string) {
    return await this.trackService.getAllTrack(skip, limit)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:trackId')
  async getTrack(@Param('trackId') trackId: string) {
    return await this.trackService.getTrack(trackId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createTrack(@Req() req: any, @Body() trackDetails: TrackDTO) {
    const userId = req.user?.userId
    return await this.trackService.createTrack(trackDetails, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:trackId')
  async updateArtist(@Req() req: any, @Param('trackId') trackId: string, @Body() userDetails: TrackDTO) {
    const userId = req.user?.userId
    return await this.trackService.updateTrack(userDetails, userId, trackId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:trackId')
  async deleteArtist(@Req() req: any, @Param('trackId') trackId) {
    const userId = req.user?.userId
    return await this.trackService.deleteTrack(userId, trackId)
  }

}

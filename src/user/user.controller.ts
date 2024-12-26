import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from "./user.service"
import { IUser } from 'database/schema/user';
import { LoginDTO } from "./dto/login.dto"
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:skip/:limit')
  async getAllUser(@Req() req: any, @Param('skip') skip: string, @Param('limit') limit: string) {
    return await this.userService.getAllUser(skip, limit)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUser(@Req() req: any) {
    const userId = req.user?.userId
    return await this.userService.getUser(userId)
  }

  @Post('/')
  async signUp(@Body() userDetails: IUser) {
    return await this.userService.signUp(userDetails)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/")
  async updateUser(@Req() req: any, @Body() userDetails: IUser) {
    const userId = req.user?.userId
    return await this.userService.updateUser(userId, userDetails)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/")
  async deleteUser(@Req() req: any) {
    const userId = req.user?.userId
    return await this.userService.deleteUser(userId)
  }

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    return await this.userService.userLogin(body.email, body.password)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add-user')
  async addUser(@Body() userDetails: IUser, @Req() req: any) {
    const userId = req.user?.userId;
    return await this.userService.addUser(userDetails, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-password')
  async updatePassword(@Body() passwordDetails: UpdatePasswordDTO, @Req() req: any) {
    const userId = req.user?.userId;
    return await this.userService.updatePassword(passwordDetails, userId);
  }
}

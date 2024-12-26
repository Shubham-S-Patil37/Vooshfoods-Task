import { Injectable, HttpException, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { IAlbum, AlbumModel } from 'database/schema/albums';
import { CreateAlbumDTO } from './dto/createAlbum.dto';
import { IUser, UserModel } from 'database/schema/user';
import { RoleEnum } from 'src/user/enums/role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AlbumsService {

  constructor(private userService: UserService) { }

  async getAllAlbums(skip: string, limit: string) {
    try {

      const skipNum = Number(skip)
      const limitNum = Number(limit)

      if (isNaN(skipNum) || skipNum < 0)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid skip amount.', },
          HttpStatus.BAD_REQUEST,
        );

      if (isNaN(limitNum) || limitNum < 1)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid limit amount.', },
          HttpStatus.BAD_REQUEST,
        );

      const albums: IAlbum[] = await AlbumModel.find({ "isActive": true }, { "isActive": 0, "__v": 0, "createdAt": 0, "updatedAt": 0 }).skip(skipNum).limit(limitNum)
      return { "data": albums, "message": "all albums retrieve", statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException)
        throw error;

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAlbum(albumId: string) {
    try {

      if (!albumId) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Album Id not found.', },
          HttpStatus.NOT_FOUND,
        );
      }

      const album: IAlbum = await AlbumModel.findOne({ _id: albumId, "isActive": true }, { "isActive": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 });
      if (!album) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Album Not Found', },
          HttpStatus.NOT_FOUND
        );
      }

      return { "data": album, "message": "Album data retrieve", statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException)
        throw error;

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createAlbum(albumData: CreateAlbumDTO, userId: string) {
    try {

      const checkUser: IUser = await this.userService.checkUser(userId, "Log in user")

      if (checkUser.role != RoleEnum.ADMIN && checkUser.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access', },
          HttpStatus.FORBIDDEN,
        );
      }

      if (!albumData.title)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Title', },
          HttpStatus.BAD_REQUEST
        );

      if (!albumData.artistId)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Artist Id', },
          HttpStatus.BAD_REQUEST
        );

      if (!albumData.releaseAt)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Date of Release', },
          HttpStatus.BAD_REQUEST
        );

      const checkArtist: IUser = await this.userService.checkUser(albumData.artistId, "Artist")

      if (checkArtist.role != RoleEnum.ARTIST) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Artist not available', },
          HttpStatus.BAD_REQUEST
        );
      }

      const newAlbum = new AlbumModel()
      Object.assign(newAlbum, albumData)

      newAlbum.isActive = true
      newAlbum.createdBy = userId

      await newAlbum.save()

      return { "data": {}, "message": "Artist created successfully", statusCode: HttpStatus.CREATED }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async updateAlbum(albumData: CreateAlbumDTO, userId: string, albumId: string) {
    try {

      const user: IUser = await UserModel.findOne({ _id: userId, "isActive": true });

      if (!user)
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User NOT FOUND', },
          HttpStatus.NOT_FOUND
        );

      if (user.role != RoleEnum.ADMIN && user.role != RoleEnum.EDITOR)
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Your are not authorize to update', },
          HttpStatus.FORBIDDEN
        );

      const album: IAlbum = await AlbumModel.findOne({ "_id": albumId })

      Object.assign(album, albumData)
      album.updatedBy = userId;

      await album.save()

      return { "data": {}, "message": "Album updated successfully !", statusCode: HttpStatus.OK }

    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAlbum(userId: string, albumId: string) {
    try {
      const checkUser: IUser = await this.userService.checkUser(userId, "User")

      if (checkUser.role != RoleEnum.ADMIN && checkUser.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Your are not authorize to delete Album', },
          HttpStatus.FORBIDDEN,
        );
      }

      const albumData: IAlbum = await AlbumModel.findOne({ "_id": albumId })

      if (!albumData)
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Album not found', },
          HttpStatus.NOT_FOUND,
        );

      albumData.isActive = false;
      albumData.updatedBy = userId;

      albumData.save()

      return { "data": {}, "message": "Album deleted ", statusCode: HttpStatus.OK }
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

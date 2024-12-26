import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IArtist, ArtistModel } from 'database/schema/artist';
import { IUser, UserModel } from "database/schema/user"
import { RoleEnum } from 'src/user/enums/role.enum';
import { CreateArtistsDTO } from './dto/createArtist.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ArtistsService {
  constructor(private userService: UserService) { }

  async getAllArtist(skip: string, limit: string, userId: string) {
    try {
      const skipNum = Number(skip)
      const limitNum = Number(limit)

      if (isNaN(skipNum) || skipNum < 0) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid skip amount.', },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isNaN(limitNum) || limitNum < 1) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid limit amount.', },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkUser: IUser = await UserModel.findOne({ "_id": userId })

      // if (checkUser.role == RoleEnum.VIEWER)
      //   throw new HttpException(
      //     { statusCode: HttpStatus.FORBIDDEN, message: 'Viewer unauthorize to see detail', },
      //     HttpStatus.FORBIDDEN,
      //   );

      const user: IUser[] = await UserModel.find({ "isActive": true, "role": RoleEnum.ARTIST }, { "isActive": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 }).skip(skipNum).limit(limitNum)

      return { "data": user, "message": "all Artist retrieve", statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getArtist(userId: string) {
    try {
      const checkUser: IUser = await this.userService.checkUser(userId, "Artist")

      if (checkUser.role != RoleEnum.ARTIST) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Log in user is not a artists', },
          HttpStatus.FORBIDDEN,
        );
      }

      const artist: IArtist = await ArtistModel.findOne({ "userId": userId }, { "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 })
      const artistData: CreateArtistsDTO = checkUser
      artistData.grammy = artist.grammy

      return { "data": artistData, "message": "Artist retrieved successfully", statusCode: HttpStatus.OK }

    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createArtist(artistData: CreateArtistsDTO, userId: string) {
    try {

      const checkUser: IUser = await this.userService.checkUser(userId, "User")

      if (checkUser.role != RoleEnum.ADMIN && checkUser.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access', },
          HttpStatus.FORBIDDEN,
        );
      }

      if (!artistData.name)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Name', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.email)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Email', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.mobileNumber)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Mobile Number', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.password)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Password', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.birth_date)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Date of Birth', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.gender)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Gender', },
          HttpStatus.BAD_REQUEST
        );

      if (!artistData.grammy)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a grammy', },
          HttpStatus.BAD_REQUEST
        );

      artistData.role = RoleEnum.ARTIST

      const artistUser: any = artistData
      const user = await this.userService.signUp(artistUser)

      const artist = new ArtistModel();
      artist.userId = user.data.userId;
      artist.grammy = artistData.grammy;
      artist.isActive = true;
      artist.createdBy = userId;
      artist.save()

      return { "data": artistData, "message": "Artist retrieved successfully", statusCode: HttpStatus.CREATED }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async updateArtist(artistData: CreateArtistsDTO, userId: string) {
    try {

      const user: IUser = await UserModel.findOne({ _id: userId, "isActive": true });

      if (!user)
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User NOT FOUND', },
          HttpStatus.NOT_FOUND
        );

      if (user.role != RoleEnum.ADMIN && user.role != RoleEnum.EDITOR)
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: ', },
          HttpStatus.FORBIDDEN
        );

      const checkUser: IUser = await UserModel.findOne({ "$or": [{ "email": artistData.email }, { "mobileNumber": artistData.mobileNumber }] })

      if (checkUser)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: `Email Address or Mobile Number already registered !`, },
          HttpStatus.BAD_REQUEST
        );

      Object.assign(user, artistData)
      user.updatedBy = userId;
      await user.save()

      return { "data": user, "message": "User updated successfully", statusCode: HttpStatus.OK }

    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteArtist(userId: string, artistId: string) {
    try {
      const user = await this.userService.checkUser(userId, "User")

      if (user.role != RoleEnum.ADMIN && user.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Your are not authorize to delete Artists', },
          HttpStatus.FORBIDDEN,
        );
      }

      const checkArtists: IUser = await this.userService.checkUser(artistId, "Artists")

      if (checkArtists.role != RoleEnum.ARTIST)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'User is not an artist. Delete operation can only be performed for artists', },
          HttpStatus.BAD_REQUEST,
        );

      checkArtists.isActive = false
      checkArtists.updatedBy = userId
      console.log(checkArtists)
      checkArtists.save();

      return { "data": {}, "message": "Artist deleted successfully", statusCode: HttpStatus.OK }

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

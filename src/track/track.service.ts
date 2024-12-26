import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ITrack, TrackModel } from 'database/schema/track';
import { TrackDTO } from './dto/createTrack.dto';
import { UserService } from 'src/user/user.service';
import { IUser } from 'database/schema/user';
import { RoleEnum } from 'src/user/enums/role.enum';

@Injectable()
export class TrackService {
  constructor(private userService: UserService) { }

  async getAllTrack(skip: string, limit: string) {
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

      const track: ITrack[] = await TrackModel.find({}).skip(skipNum).limit(limitNum)

      return { "data": track, "message": "all track retrieve", statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTrack(trackId: string) {
    try {
      const track: ITrack = await TrackModel.findOne({ "_id": trackId })

      if (!track) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: `track not found`, },
          HttpStatus.NOT_FOUND,
        );
      }

      return { "data": track, "message": "Track retrieved successfully", statusCode: HttpStatus.OK }

    }
    catch (error) {

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createTrack(trackData: TrackDTO, userId: string) {
    try {

      const checkUser: IUser = await this.userService.checkUser(userId, "User")

      if (checkUser.role != RoleEnum.ADMIN && checkUser.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access', },
          HttpStatus.FORBIDDEN,
        );
      }

      if (!trackData.name)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Name', },
          HttpStatus.BAD_REQUEST
        );

      if (!trackData.duration)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Duration', },
          HttpStatus.BAD_REQUEST
        );

      if (!trackData.albumId)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Album Id', },
          HttpStatus.BAD_REQUEST
        );

      const track: ITrack = await TrackModel.findOne({ name: trackData.name })

      if (track)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The Track name already exists', },
          HttpStatus.BAD_REQUEST
        );

      const newTrack = new TrackModel(trackData);

      newTrack.createdBy = userId
      newTrack.isActive = true

      newTrack.save()
      return { "data": {}, "message": "Track created successfully", statusCode: HttpStatus.CREATED }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async updateTrack(trackData: TrackDTO, userId: string, trackId: string) {
    try {

      const checkUser: IUser = await this.userService.checkUser(userId, "User")

      if (checkUser.role != RoleEnum.ADMIN && checkUser.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access', },
          HttpStatus.FORBIDDEN,
        );
      }

      const checkTrack: ITrack = await TrackModel.findOne({ "_id": trackId })

      const checkTrackName: ITrack = await TrackModel.findOne({ "name": trackData.name, _id: { $ne: trackId } })

      if (checkTrackName)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The Track name already exists', },
          HttpStatus.BAD_REQUEST
        );



      Object.assign(checkTrack, trackData)
      checkTrack.updatedBy = userId

      await checkTrack.save()

      return { "data": {}, "message": "Track updated successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  async deleteTrack(userId: string, trackId: String) {
    try {
      const user: IUser = await this.userService.checkUser(userId, "User")

      if (user.role != RoleEnum.ADMIN && user.role != RoleEnum.EDITOR) {
        throw new HttpException(
          { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden Access: Your are not authorize to delete Track', },
          HttpStatus.FORBIDDEN,
        );
      }

      const checkTrack: ITrack = await TrackModel.findOne({ "_id": trackId })
      if (!checkTrack) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: `track not found`, },
          HttpStatus.NOT_FOUND,
        );
      }

      checkTrack.updatedBy = userId
      checkTrack.isActive = false
      checkTrack.save()

      return { "data": {}, "message": "Track deleted successfully", statusCode: HttpStatus.OK }

    }
    catch (error) {
      return { "data": error, "message": "Error in update user", statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
    }
  }

}

import { IUser, UserModel } from "../../database/schema/user"
import { Injectable, HttpException, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { RoleEnum } from "./enums/role.enum";
@Injectable()
export class UserService {

  constructor(private jwtService: JwtService) { }

  async getAllUser(skip: string, limit: string) {
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

      const user: IUser[] = await UserModel.find({ "isActive": true }, { "isActive": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 }).skip(skipNum).limit(limitNum).exec()
      return { "data": user, "message": "all user retrieve", statusCode: HttpStatus.OK }
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

  async getUser(userId: string) {
    try {

      if (!userId) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User Id not found.', },
          HttpStatus.NOT_FOUND,
        );
      }

      const user: IUser = await UserModel.findOne({ _id: userId, "isActive": true }, { "isActive": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 });
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User Not Found',
          },
          HttpStatus.NOT_FOUND
        );
      }

      return { "data": user, "message": "User data retrieve", statusCode: HttpStatus.OK }
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

  async signUp(userDetails: IUser) {
    try {

      if (!userDetails.name)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Name',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.email)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Email',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.mobileNumber)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Mobile Number',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.password)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Password',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.birth_date)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Date of Birth',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.gender)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Gender',
          },
          HttpStatus.BAD_REQUEST
        );

      const isFirstUser: IUser = await UserModel.findOne({})
      console.log(isFirstUser)
      if (!isFirstUser)
        userDetails.role = RoleEnum.ADMIN
      else
        if (!userDetails.role)
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'The request is missing a User Role',
            },
            HttpStatus.BAD_REQUEST
          );

      let parsedDate = new Date(userDetails.birth_date);

      if (isNaN(parsedDate.getTime()))
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Invalid Date:- ${parsedDate}`,
          },
          HttpStatus.BAD_REQUEST
        );

      userDetails.birth_date = parsedDate
      userDetails.isActive = true;

      const checkUser: IUser = await UserModel.findOne({ "$or": [{ "email": userDetails.email }, { "mobileNumber": userDetails.mobileNumber },] })

      if (checkUser)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: `Email Address or Mobile Number already registered !`, },
          HttpStatus.BAD_REQUEST
        );


      const newUser = new UserModel(userDetails);
      const user = await newUser.save()

      return {
        statusCode: HttpStatus.OK,
        message: "User created successfully",
        data: { userId: user._id.toString() }
      };

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

  async updateUser(userId: string, userDetail: IUser) {
    try {
      const user: IUser = await UserModel.findOne({ _id: userId, "isActive": true });
      if (!user)
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No user is available for the provided ID',
          },
          HttpStatus.NOT_FOUND
        );

      const checkUser: IUser = await UserModel.findOne({
        "$or": [{ "email": userDetail.email }, { "mobileNumber": userDetail.mobileNumber },]
      })

      if (checkUser)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Email Address or Mobile Number already registered !`,
          },
          HttpStatus.BAD_REQUEST
        );

      Object.assign(user, userDetail)


      const updated = await user.save()
      return { "data": user, "message": "User updated successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      return { "data": error, "message": "Error in update user", statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
    }
  }

  async deleteUser(userId: string) {
    try {
      const user: IUser = await UserModel.findOne({ _id: userId });
      if (!user)
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No user is available for the provided ID',
          },
          HttpStatus.NOT_FOUND
        );

      user.isActive = false
      await user.save()
      return { "data": {}, "message": "User deleted successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      return { "data": error, "message": "Error in update user", statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
    }
  }

  async userLogin(emailAddress: string, password: string) {
    try {

      if (!emailAddress)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Email',
          },
          HttpStatus.BAD_REQUEST
        );

      if (!password)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'The request is missing a Password',
          },
          HttpStatus.BAD_REQUEST
        );

      const user: IUser = await UserModel.findOne({ email: emailAddress, password: password });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'User log in failed',
          },
          HttpStatus.UNAUTHORIZED
        );
      }


      if (user.isActive) {
        const payload = { sub: user._id, username: user.name };
        const token = this.jwtService.sign(payload);

        return { "data": { accessToken: token }, "message": "User log in successfully", statusCode: HttpStatus.OK };
      }
      else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'User not have active session',
          },
          HttpStatus.BAD_REQUEST
        );
      }

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

  async addUser(userDetails: IUser, userId: string) {
    try {

      if (!userDetails.name)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Name', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.email)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing an Email', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.mobileNumber)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Mobile Number', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.password)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Password', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.birth_date)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Date of Birth', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.gender)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Gender', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.role)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a User Role', },
          HttpStatus.BAD_REQUEST
        );

      let parsedDate = new Date(userDetails.birth_date);

      if (isNaN(parsedDate.getTime()))
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: `Invalid Date: ${parsedDate}`, },
          HttpStatus.BAD_REQUEST
        );

      userDetails.birth_date = parsedDate;
      userDetails.isActive = true;
      userDetails.createdBy = userId;

      if (userDetails.role !== RoleEnum.EDITOR && userDetails.role !== RoleEnum.VIEWER) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: "Invalid role. User must have either EDITOR or VIEWER role", },
          HttpStatus.BAD_REQUEST
        );
      }

      const userDetail: IUser = await UserModel.findOne({ "_id": userId });

      if (userDetail.role != RoleEnum.ADMIN) {
        throw new HttpException(
          { statusCode: HttpStatus.UNAUTHORIZED, message: "Only Admin can add user" },
          HttpStatus.UNAUTHORIZED
        );
      }

      const checkUser: IUser = await UserModel.findOne({ "$or": [{ "email": userDetails.email }, { "mobileNumber": userDetails.mobileNumber }], });
      if (checkUser)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: "Email Address or Mobile Number already registered!", },
          HttpStatus.BAD_REQUEST
        );


      const newUser = new UserModel(userDetails);
      const user = await newUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: "User created successfully",
        data: { userId: user._id.toString() },
      };

    } catch (error) {

      if (error instanceof HttpException)
        throw error;


      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePassword(passwordDetails: UpdatePasswordDTO, userId: string) {
    try {

      if (!userId) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid User ID', },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user: IUser = await UserModel.findOne({ "_id": userId })

      if (!user) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!passwordDetails.currentPassword)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Current Password', },
          HttpStatus.BAD_REQUEST,
        );

      if (!passwordDetails.password)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Password', },
          HttpStatus.BAD_REQUEST,
        );

      if (!passwordDetails.confirmPassword)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Confirm Password', },
          HttpStatus.BAD_REQUEST,
        );

      if (user.password != passwordDetails.currentPassword) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Current password is incorrect. Please try again.' },
          HttpStatus.BAD_REQUEST
        );
      }

      if (passwordDetails.confirmPassword != passwordDetails.password) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'Passwords do not align. Please re-enter and confirm.' },
          HttpStatus.BAD_REQUEST
        )
      }
      user.password = passwordDetails.password;
      await user.save();

      return {
        message: 'Password updated successfully',
        statusCode: HttpStatus.OK
      }
    }
    catch (error) {

      if (error instanceof HttpException)
        throw error;

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async checkUser(userId: string, sub: string): Promise<IUser> {
    try {
      const checkUser: IUser = await UserModel.findOne({ "_id": userId, "isActive": true })
      // const checkUser: IUser = await UserModel.findOne({ "_id": userId })
      if (!checkUser) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: `${sub} not found`, },
          HttpStatus.NOT_FOUND,
        );
      }

      return checkUser

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

import { Body, Controller, Get, Injectable, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserEntity } from "./user.entity";
// import { ExpressRequest } from "@app/types/expressRequest.interface";

export class ExpressRequest extends Request {
  user?: UserEntity
  // headers: HeadersWithToken;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto)
    return this.userService.buildUserResponse(user)
  }

  // @Injectable()
  @Get('user')
  async currentUser(@Req() request:ExpressRequest): Promise<UserResponseInterface> {
    console.log('user', request.user)
    return 'currentUser' as any
  }

}
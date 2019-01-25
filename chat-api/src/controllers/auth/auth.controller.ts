import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../../models/user.model';
import { ModelType } from 'typegoose';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { environment } from '../../environment';

@Controller('api/auth')
export class AuthController {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {} // <1>

  @Post('login')
  async login(@Body() credentials) { // <2>
    const user = await this.userModel.findOne({nickname: credentials.nickname}).exec();
    if (!user) throw new UnauthorizedException('The nickname/password combination is invalid');

    const isMatch = await compare(credentials.password, user.password);
    if (!isMatch) throw new UnauthorizedException('The nickname/password combination is invalid');

    user.loggedIn = true;

    await user.save();

    return {token: sign({_id: user._id, nickname: user.nickname}, environment.JWT_SECRET_PASSWORD, {expiresIn: '1h'})};
  }

  @Get('logout')
  async logout(@CurrentUser() user) { // <3>
    await this.userModel.findByIdAndUpdate(user._id, {loggedIn: false});
    return {message: 'Logout Successfully'};
  }

  @Post('sign-up')
  async signup(@Body() signupCredentials) { // <4>
    signupCredentials.password = await hash(signupCredentials.password, 10);
    await this.userModel.create(signupCredentials);
    return {message: 'User Created Successfully'};
  }
}

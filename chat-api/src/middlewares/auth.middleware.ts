import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { environment } from '../environment';
import { expressjwt } from 'express-jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {} // <1>

  use(req, res, next) {
    expressjwt({ // <2>
      secret: environment.JWT_SECRET_PASSWORD, // <3>
      algorithms: ['HS256'],
      isRevoked: async (req1, token) => { // <4>
        const payload = token?.payload as JwtPayload;
        if (!payload._id) {
          throw new UnauthorizedException('The token contains invalid credentials or has expired');
        }

        const user = await this.userModel.findById(payload._id).exec();
        if (!user || !user.loggedIn) throw new UnauthorizedException('The user has been logged out');

        return false;
      },
    }).unless({path: ['/api/auth/login', '/api/auth/sign-up']})(req, res, next); // <5>
  }
}

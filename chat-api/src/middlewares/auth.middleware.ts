import { Injectable, MiddlewareFunction, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { User } from '../models/user.model';
import { environment } from '../environment';
import jwt = require('express-jwt');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {} // <1>

  resolve(...args: any[]): MiddlewareFunction {
    return jwt({ // <2>
      secret: environment.JWT_SECRET_PASSWORD, // <3>
      isRevoked: async (req, payload, done) => { // <4>
        if (!payload._id) {
          return done(new UnauthorizedException('The token contains invalid credentials or has expired'));
        }

        const user = await this.userModel.findById(payload._id).exec();
        if (!user || !user.loggedIn) return done(new UnauthorizedException('The user has been logged out'));

        done(null, false);
      },
    }).unless({path: ['/api/auth/login', '/api/auth/sign-up']}); // <5>
  }
}

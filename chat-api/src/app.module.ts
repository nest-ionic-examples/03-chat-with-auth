import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesGateway } from './gateways/messages/messages.gateway';
import { MessagesController } from './controllers/messages/messages.controller';
import { RoomsController } from './controllers/rooms/rooms.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from './models/message.model';
import { Room } from './models/room.model';
import { User } from './models/user.model';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { environment } from './environment';

@Module({
  imports: [
    TypegooseModule.forRoot(environment.MONGO_DB_URL, {}),
    TypegooseModule.forFeature([Message, Room, User]),
  ],
  controllers: [
    AppController,
    RoomsController,
    MessagesController,
    AuthController,
  ],
  providers: [AppService, MessagesGateway],
})
export class AppModule implements NestModule {
  // tag::app-use-jwt[]
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .forRoutes('/api'); // <1>
  }
  // end::app-use-jwt[]
}

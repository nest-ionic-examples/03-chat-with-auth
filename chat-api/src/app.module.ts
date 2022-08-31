import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesGateway } from './gateways/messages/messages.gateway';
import { MessagesController } from './controllers/messages/messages.controller';
import { RoomsController } from './controllers/rooms/rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './models/message.model';
import { Room, RoomSchema } from './models/room.model';
import { User, UserSchema } from './models/user.model';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { environment } from './environment';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGO_DB_URL, {}),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
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

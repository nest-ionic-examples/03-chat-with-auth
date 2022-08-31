import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { Room } from '../../models/room.model';
import { InjectModel } from '@nestjs/mongoose';
import { CustomSocket } from '../../adapters/auth.adapter';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayDisconnect {

  constructor(@InjectModel(Message.name) private readonly messagesModel: Model<Message>,
              @InjectModel(Room.name) private readonly roomsModel: Model<Room>,
              @InjectModel(User.name) private readonly usersModel: Model<User>) {
  }

  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: CustomSocket) { // <1>
    this.server.emit('users-changed', {user: client.user.nickname, event: 'left'});
  }

  @SubscribeMessage('enter-chat-room') // <3>
  async enterChatRoom(client: CustomSocket, roomId: string) {
    client.join(roomId);
    client.broadcast.to(roomId)
      .emit('users-changed', {user: client.user.nickname, event: 'joined'}); // <2>
  }

  @SubscribeMessage('leave-chat-room') // <3>
  async leaveChatRoom(client: CustomSocket, roomId: string) {
    client.broadcast.to(roomId).emit('users-changed', {user: client.user.nickname, event: 'left'}); // <3>
    client.leave(roomId);
  }

  @SubscribeMessage('add-message') // <4>
  async addMessage(client: CustomSocket, message: Message) {
    message.owner = client.user._id;
    message.created = new Date();
    message = await this.messagesModel.create(message);
    message.owner = {_id: client.user._id, nickname: client.user.nickname} as User;
    this.server.in(message.room as string).emit('message', message);
  }
}

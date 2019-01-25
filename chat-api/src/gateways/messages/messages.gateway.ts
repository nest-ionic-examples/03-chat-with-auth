import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ModelType } from 'typegoose';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { Room } from '../../models/room.model';
import { InjectModel } from 'nestjs-typegoose';
import { CustomSocket } from '../../adapters/auth.adapter';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayDisconnect {

  constructor(@InjectModel(Message) private readonly messagesModel: ModelType<Message>,
              @InjectModel(Room) private readonly roomsModel: ModelType<Room>,
              @InjectModel(User) private readonly usersModel: ModelType<User>) {
  }

  async handleDisconnect(client: CustomSocket) { // <1>
    client.server.emit('users-changed', {user: client.user.nickname, event: 'left'});
  }

  @SubscribeMessage('enter-chat-room') // <3>
  async enterChatRoom(client: CustomSocket, roomId: string) {
    client.join(roomId).to(roomId)
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
    message = (await this.messagesModel.create(message)).toJSON();
    message.owner = {_id: client.user._id, nickname: client.user.nickname};
    client.server.in(message.room as string).emit('message', message);
  }
}

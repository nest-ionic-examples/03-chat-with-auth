import { Message } from './message.model';
import { Room } from './room.model';
import { pre, prop, Ref, Typegoose } from 'typegoose';
import { ObjectID } from 'bson';

export class User extends Typegoose {
  _id: ObjectID | string;

  @prop({
    required: true,
    maxlength: 20,
    minlength: 5,
    unique: true, // <1>
  })
  nickname: string;

  @prop({required: true})
  password: string; // <2>

  @prop()
  loggedIn: boolean; // <3>

  messages: Ref<Message>[];

  joinedRooms: Ref<Room>[];
}

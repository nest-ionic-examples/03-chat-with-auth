import {Message} from './message.model';
import {Room} from './room.model';
import {ObjectID} from 'bson';
import {Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class User {
  _id?: ObjectID | string;

  @Prop({
    required: true,
    maxlength: 20,
    minlength: 5,
    unique: true // <1>
  })
  nickname: string;

  @Prop({required: true})
  password: string; // <2>

  @Prop()
  loggedIn: boolean; // <3>

  @Prop({type: [{type: Types.ObjectId, ref: 'Message'}]})
  messages?: Message[];

  @Prop({type: [{type: Types.ObjectId, ref: 'Room'}]})
  joinedRooms?: Room[];
}

export const UserSchema = SchemaFactory.createForClass(User)

import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../../models/message.model';
import { Model } from 'mongoose';

@Controller('api/messages')
export class MessagesController {
  constructor(@InjectModel(Message.name) private readonly model: Model<Message>) {}

  @Get()
  find(@Query('where') where) {
    where = JSON.parse(where || '{}');
    return this.model.find(where).populate({path: 'owner', select: '_id nickname'}); // <1>
  }
}

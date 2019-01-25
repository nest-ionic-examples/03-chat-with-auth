import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Message } from '../../models/message.model';
import { ModelType } from 'typegoose';

@Controller('api/messages')
export class MessagesController {
  constructor(@InjectModel(Message) private readonly model: ModelType<Message>) {}

  @Get()
  find(@Query('where') where) {
    where = JSON.parse(where || '{}');
    return this.model.find(where).populate({path: 'owner', select: '_id nickname'}); // <1>
  }
}

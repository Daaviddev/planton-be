import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma.module';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesRepository } from './chat-messages.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ChatMessagesController],
  providers: [
    ChatMessagesService,
    { provide: 'ChatMessagesRepository', useClass: ChatMessagesRepository },
  ],
  exports: [ChatMessagesService, 'ChatMessagesRepository'],
})
export class ChatMessagesModule {}

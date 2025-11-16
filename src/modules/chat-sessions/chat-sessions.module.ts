import { Module } from '@nestjs/common';
import { ChatSessionsService } from './chat-sessions.service';
import { ChatSessionsController } from './chat-sessions.controller';
import { ChatSessionsRepository } from './chat-sessions.repository';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatSessionsController],
  providers: [ChatSessionsService, ChatSessionsRepository],
  exports: [ChatSessionsService],
})
export class ChatSessionsModule {}

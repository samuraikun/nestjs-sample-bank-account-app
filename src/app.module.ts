import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { AccountService } from './account.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AccountService, PrismaService],
})
export class AppModule { }

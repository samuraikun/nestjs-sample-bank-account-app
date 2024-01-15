import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService],
})
export class AccountsModule { }

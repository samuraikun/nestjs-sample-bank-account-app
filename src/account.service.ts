import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) { }

  async account(
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: accountWhereUniqueInput });
  }
}

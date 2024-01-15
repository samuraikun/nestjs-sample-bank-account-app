import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Account, Prisma } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) { }

  create(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  findAll(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  findOne(
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: accountWhereUniqueInput });
  }

  update(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: UpdateAccountDto;
  }): Promise<Account> {
    const { where, data } = params;
    return this.prisma.account.update({
      data,
      where,
    });
  }

  remove(where: Prisma.AccountWhereUniqueInput): Promise<Account> {
    return this.prisma.account.delete({ where });
  }
}

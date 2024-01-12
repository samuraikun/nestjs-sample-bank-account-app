import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account as AccountModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly accountService: AccountService) { }

  @Get()
  async getAccount(): Promise<AccountModel> {
    return this.accountService.account({ id: 1 });
  }
}

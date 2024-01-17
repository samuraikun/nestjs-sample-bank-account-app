import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('deposit')
  deposit(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.deposit(createTransactionDto);
  }

  @Post('withdraw')
  withdraw(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.withdraw(createTransactionDto);
  }

  @Post('transfer')
  transfer(@Body() transferTransactionDto: TransferTransactionDto) {
    return this.transactionsService.transfer(transferTransactionDto);
  }
}

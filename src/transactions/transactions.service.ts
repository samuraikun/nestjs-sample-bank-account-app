import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Account, Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  async deposit(createTransactionDto: CreateTransactionDto): Promise<{ transaction: Transaction, account: Account }> {
    const { Account, amount } = createTransactionDto;
    const transaction = this.prisma.transaction.create({
      data: {
        amount,
        type: 'deposit',
        accountId: Account.connect.id,
      },
    });
    const updateAccountBalance = this.prisma.account.update({
      where: { id: Account.connect.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    try {
      const [transactionRecord, accountRecord] = await this.prisma.$transaction([transaction, updateAccountBalance]);

      return {
        account: accountRecord,
        transaction: transactionRecord,
      }
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    }
  }

  async withdraw(createTransactionDto: CreateTransactionDto): Promise<{ transaction: Transaction, account: Account }> {
    const { Account, amount } = createTransactionDto;
    const transaction = this.prisma.transaction.create({
      data: {
        amount,
        type: 'withdraw',
        accountId: Account.connect.id,
      },
    });
    const updateAccountBalance = this.prisma.account.update({
      where: { id: Account.connect.id },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    try {
      const [transactionRecord, accountRecord] = await this.prisma.$transaction([transaction, updateAccountBalance]);

      return {
        account: accountRecord,
        transaction: transactionRecord,
      }
    } catch (error) {
      console.error('Withdraw failed:', error);
      throw error;
    }
  }

  async transfer(transferTransactionDto: TransferTransactionDto): Promise<{ transaction: Transaction, fromAccount: Account, toAccount: Account }> {
    const { fromAccount, toAccount, amount } = transferTransactionDto;

    try {
      // MEMO: Use interactive transaction to ensure data integrity
      // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Create transaction record
        const transaction = await tx.transaction.create({
          data: {
            amount,
            type: 'transfer',
            accountId: fromAccount.connect.id,
          },
        });

        // 2. Decrement amount from sender account
        const fromAccountRecord = await tx.account.update({
          where: { id: fromAccount.connect.id },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        // 3. Verify that the sender's balance didn't go below zero.
        if (fromAccountRecord.balance < 0) {
          throw new Error('Insufficient funds');
        }

        // 4. Increment amount to receiver account
        const toAccountRecord = await tx.account.update({
          where: { id: toAccount.connect.id },
          data: {
            balance: {
              increment: amount,
            },
          },
        });

        return { transaction, fromAccount: fromAccountRecord, toAccount: toAccountRecord };
      });

      return result;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }

  // findAll(): Promise<Transaction[]> { }

  // findOne(id: number): Promise<Transaction> { }

  // findAllByAccount(accountId: number): Promise<Transaction[]> { }

  // findAllByAccountAndDate(accountId: number, date: Date): Promise<Transaction[]> { }
}

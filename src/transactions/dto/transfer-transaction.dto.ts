import { Prisma } from '@prisma/client';

export type TransferTransactionDto = Omit<Prisma.TransactionCreateInput, 'Account'> & {
  fromAccount: {
    connect: {
      id: number;
    };
  },
  toAccount: {
    connect: {
      id: number;
    };
  },
};

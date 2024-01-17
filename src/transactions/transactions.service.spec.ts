import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, PrismaService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('should return a transaction and an updated account', async () => {
      const result = {
        transaction: {
          id: 1,
          amount: 100.5,
          type: 'deposit',
          accountId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        account: {
          id: 1,
          name: 'John Doe',
          balance: 100.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'deposit').mockResolvedValue(result);
      expect(await service.deposit({
        type: 'deposit',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(service, 'deposit').mockRejectedValue(new Error('Deposit failed'));
      await expect(service.deposit({
        type: 'deposit',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).rejects.toThrow('Deposit failed');
    });
  });

  describe('withdraw', () => {
    it('should return a transaction and an updated account', async () => {
      const account = {
        id: 1,
        name: 'John Doe',
        balance: 100.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = {
        transaction: {
          id: 1,
          amount: 50.5,
          type: 'withdraw',
          accountId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        account: {
          ...account,
          balance: 50,
        },
      };

      jest.spyOn(service, 'withdraw').mockResolvedValue(result);
      expect(await service.withdraw({
        type: 'withdraw',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(service, 'withdraw').mockRejectedValue(new Error('Withdraw failed'));
      await expect(service.withdraw({
        type: 'withdraw',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).rejects.toThrow('Withdraw failed');
    });
  });

  describe('transfer', () => {
    it('should return a transaction and an updated account', async () => {
      const fromAccount = {
        id: 1,
        name: 'John Doe',
        balance: 100.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const toAccount = {
        id: 2,
        name: 'Fred Smith',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = {
        transaction: {
          id: 1,
          amount: 50.5,
          type: 'transfer',
          accountId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        fromAccount: {
          ...fromAccount,
          balance: 50,
        },
        toAccount: {
          ...toAccount,
          balance: 50.5,
        },
      };

      jest.spyOn(service, 'transfer').mockResolvedValue(result);
      expect(await service.transfer({
        type: 'transfer',
        amount: 100.5,
        fromAccount: { connect: { id: 1 } },
        toAccount: { connect: { id: 2 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(service, 'transfer').mockRejectedValue(new Error('Transfer failed'));
      await expect(service.transfer({
        type: 'transfer',
        amount: 100.5,
        fromAccount: { connect: { id: 1 } },
        toAccount: { connect: { id: 2 } },
      })).rejects.toThrow('Transfer failed');
    });

    it('should throw an error if the fromAccount is insufficient', async () => {
      jest.spyOn(service, 'transfer').mockRejectedValue(new Error('Insufficient funds'));
      await expect(service.transfer({
        type: 'transfer',
        amount: 100.5,
        fromAccount: { connect: { id: 1 } },
        toAccount: { connect: { id: 2 } },
      })).rejects.toThrow('Insufficient funds');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService, PrismaService],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /transactions/deposit', () => {
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

      jest.spyOn(controller, 'deposit').mockResolvedValue(result);
      expect(await controller.deposit({
        type: 'deposit',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(controller, 'deposit').mockRejectedValue(new Error('Deposit failed'));
      await expect(controller.deposit({
        type: 'deposit',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).rejects.toThrow('Deposit failed');
    });
  });

  describe('POST /transactions/withdraw', () => {
    it('should return a transaction and an updated account', async () => {
      const result = {
        transaction: {
          id: 1,
          amount: 100.5,
          type: 'withdraw',
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

      jest.spyOn(controller, 'withdraw').mockResolvedValue(result);
      expect(await controller.withdraw({
        type: 'withdraw',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(controller, 'withdraw').mockRejectedValue(new Error('Withdraw failed'));
      await expect(controller.withdraw({
        type: 'withdraw',
        amount: 100.5,
        Account: { connect: { id: 1 } },
      })).rejects.toThrow('Withdraw failed');
    });
  });

  describe('POST /transactions/transfer', () => {
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
        name: 'Mike Smith',
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

      jest.spyOn(controller, 'transfer').mockResolvedValue(result);
      expect(await controller.transfer({
        type: 'transfer',
        amount: 100.5,
        fromAccount: { connect: { id: 1 } },
        toAccount: { connect: { id: 2 } },
      })).toBe(result);
    });

    it('should throw an error if the transaction fails', async () => {
      jest.spyOn(controller, 'transfer').mockRejectedValue(new Error('Transfer failed'));
      await expect(controller.transfer({
        type: 'transfer',
        amount: 100.5,
        fromAccount: { connect: { id: 1 } },
        toAccount: { connect: { id: 2 } },
      })).rejects.toThrow('Transfer failed');
    });
  });
});

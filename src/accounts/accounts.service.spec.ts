import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma.service';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService, PrismaService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get Account', () => {
    it('should return an array of accounts', async () => {
      const result = [
        {
          id: 1,
          name: 'John Doe',
          balance: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Jane Doe',
          balance: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });

    it('should return an account', async () => {
      const result = {
        id: 1,
        name: 'John Doe',
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await service.findOne({ id: 1 })).toBe(result);
    });
  });

  describe('Create Account', () => {
    it('should create an account', async () => {
      const params = {
        name: 'John Doe',
        balance: 100,
      };
      const result = {
        ...params,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        transactions: [],
      }

      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await service.create({ name: 'John Doe', balance: 100 })).toBe(result);
    });
  });

  describe('Update Account', () => {
    it('should update an account', async () => {
      const params = {
        name: 'John Doe',
        balance: 350,
      };
      const result = {
        ...params,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        transactions: [],
      }

      jest.spyOn(service, 'update').mockResolvedValue(result);
      expect(await service.update({ where: { id: 1 }, data: params })).toBe(result);
    });
  });

  describe('Delete Account', () => {
    it('should delete an account', async () => {
      const result = {
        id: 1,
        name: 'John Doe',
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect(await service.remove({ id: 1 })).toBe(result);
    });
  });
});

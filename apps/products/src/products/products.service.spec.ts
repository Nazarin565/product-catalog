import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SqsPublisherService } from '../messaging/sqs-publisher.service';
import { ProductEventType } from '@universe/shared';

const mockDb = {
  insert: jest.fn(),
  update: jest.fn(),
  select: jest.fn(),
};

const mockSqsPublisher: jest.Mocked<SqsPublisherService> = {
  publish: jest.fn(),
} as any;

const makeService = () =>
  new ProductsService(mockDb as any, mockSqsPublisher);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProductsService', () => {
  describe('create', () => {
    it('inserts a product and publishes a created event', async () => {
      const product = { id: 'uuid-1', name: 'Widget', price: '9.99', description: null };
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([product]),
        }),
      });
      mockSqsPublisher.publish.mockResolvedValue(undefined);

      const service = makeService();
      const result = await service.create({ name: 'Widget', price: 9.99 });

      expect(result).toEqual(product);
      expect(mockSqsPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ProductEventType.Created,
          id: 'uuid-1',
          name: 'Widget',
          price: 9.99,
        }),
      );
    });
  });

  describe('remove', () => {
    it('soft-deletes a product and publishes a deleted event', async () => {
      const product = { id: 'uuid-1', name: 'Widget', price: '9.99', deletedAt: new Date() };
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([product]),
          }),
        }),
      });
      mockSqsPublisher.publish.mockResolvedValue(undefined);

      const service = makeService();
      const result = await service.remove('uuid-1');

      expect(result).toEqual(product);
      expect(mockSqsPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ProductEventType.Deleted,
          id: 'uuid-1',
        }),
      );
    });

    it('throws NotFoundException when product not found or already deleted', async () => {
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const service = makeService();
      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockSqsPublisher.publish).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated items with correct meta', async () => {
      const items = [
        { id: 'uuid-1', name: 'Widget', price: '9.99', deletedAt: null },
        { id: 'uuid-2', name: 'Gadget', price: '19.99', deletedAt: null },
      ];

      let callCount = 0;
      mockDb.select.mockImplementation(() => ({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              offset: jest.fn().mockResolvedValue(items),
            }),
            // for the count query
            then: undefined,
          }),
        }),
      }));

      // We need two different select calls: one for items, one for count
      mockDb.select
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(items),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 2 }]),
          }),
        });

      const service = makeService();
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 });
    });

    it('calculates totalPages correctly', async () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        id: `uuid-${i}`,
        name: `Product ${i}`,
        price: '5.00',
        deletedAt: null,
      }));

      mockDb.select
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(items),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 25 }]),
          }),
        });

      const service = makeService();
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.meta.total).toBe(25);
      expect(result.meta.totalPages).toBe(3);
    });
  });
});

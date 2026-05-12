import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ProductEventType } from '@universe/shared';
import { Message } from '@aws-sdk/client-sqs';

const makeMessage = (body: unknown): Message => ({
  Body: JSON.stringify(body),
});

describe('NotificationsService', () => {
  let service: NotificationsService;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new NotificationsService();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs correct fields for product.created event', async () => {
    const message = makeMessage({
      type: ProductEventType.Created,
      id: 'uuid-1',
      name: 'Widget',
      price: 9.99,
      timestamp: '2024-01-01T00:00:00.000Z',
    });

    await service.handleMessage(message);

    expect(logSpy).toHaveBeenCalledWith({
      event: ProductEventType.Created,
      id: 'uuid-1',
      name: 'Widget',
      price: 9.99,
      timestamp: '2024-01-01T00:00:00.000Z',
    });
  });

  it('logs correct fields for product.deleted event', async () => {
    const message = makeMessage({
      type: ProductEventType.Deleted,
      id: 'uuid-2',
      timestamp: '2024-01-02T00:00:00.000Z',
    });

    await service.handleMessage(message);

    expect(logSpy).toHaveBeenCalledWith({
      event: ProductEventType.Deleted,
      id: 'uuid-2',
      timestamp: '2024-01-02T00:00:00.000Z',
    });
  });

  it('warns on unknown event type', async () => {
    const raw = JSON.stringify({ type: 'product.unknown', id: 'uuid-3' });
    const message: Message = { Body: raw };

    await service.handleMessage(message);

    expect(warnSpy).toHaveBeenCalledWith({ event: 'unknown', raw });
  });

  it('does not throw on malformed JSON body', async () => {
    const message: Message = { Body: 'not-json' };
    await expect(service.handleMessage(message)).rejects.toThrow(SyntaxError);
  });

  it('handles empty Body gracefully', async () => {
    const message: Message = { Body: undefined };

    await service.handleMessage(message);

    expect(warnSpy).toHaveBeenCalledWith({ event: 'unknown', raw: undefined });
  });
});

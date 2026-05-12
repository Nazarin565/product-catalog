export enum ProductEventType {
  Created = 'product.created',
  Deleted = 'product.deleted',
}

export interface ProductCreatedEvent {
  type: ProductEventType.Created;
  id: string;
  name: string;
  price: number;
  timestamp: string;
}

export interface ProductDeletedEvent {
  type: ProductEventType.Deleted;
  id: string;
  timestamp: string;
}

export type ProductEvent = ProductCreatedEvent | ProductDeletedEvent;

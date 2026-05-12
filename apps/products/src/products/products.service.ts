import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count as drizzleCount, desc, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from '../database/database.module';
import { products } from '../database/schema';
import { SqsPublisherService } from '../messaging/sqs-publisher.service';
import { ProductEventType } from '@universe/shared';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from './dto/pagination.dto';
import * as schema from '../database/schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: NodePgDatabase<typeof schema>,
    private readonly sqsPublisher: SqsPublisherService,
  ) {}

  async create(dto: CreateProductDto) {
    const [product] = await this.db
      .insert(products)
      .values({
        name: dto.name,
        description: dto.description,
        price: String(dto.price),
      })
      .returning();

    await this.sqsPublisher.publish({
      type: ProductEventType.Created,
      id: product.id,
      name: product.name,
      price: Number(product.price),
      timestamp: new Date().toISOString(),
    });

    return product;
  }

  async remove(id: string) {
    const [product] = await this.db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    await this.sqsPublisher.publish({
      type: ProductEventType.Deleted,
      id: product.id,
      timestamp: new Date().toISOString(),
    });

    return product;
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [items, [{ count }]] = await Promise.all([
      this.db
        .select()
        .from(products)
        .where(isNull(products.deletedAt))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: drizzleCount() })
        .from(products)
        .where(isNull(products.deletedAt)),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  }
}

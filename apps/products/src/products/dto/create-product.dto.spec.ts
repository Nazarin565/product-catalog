import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

const build = (data: object) => plainToInstance(CreateProductDto, data);

describe('CreateProductDto', () => {
  it('passes with valid data', async () => {
    const dto = build({ name: 'Widget', description: 'A nice widget', price: 9.99 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('passes without optional description', async () => {
    const dto = build({ name: 'Widget', price: 9.99 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when name is empty', async () => {
    const dto = build({ name: '', price: 9.99 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('fails when name is missing', async () => {
    const dto = build({ price: 9.99 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('fails when name exceeds 255 characters', async () => {
    const dto = build({ name: 'a'.repeat(256), price: 9.99 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('fails when price is negative', async () => {
    const dto = build({ name: 'Widget', price: -1 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('fails when price is zero', async () => {
    const dto = build({ name: 'Widget', price: 0 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('fails when price has more than 2 decimal places', async () => {
    const dto = build({ name: 'Widget', price: 9.999 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('fails when price is missing', async () => {
    const dto = build({ name: 'Widget' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });
});

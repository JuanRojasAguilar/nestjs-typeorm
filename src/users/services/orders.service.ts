import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  findAll() {
    this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: id,
      },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${order} not found`);
    }
    return order;
  }

  async ordersByCustomer(customerId: number) {
    return this.orderRepo.find({
      where: {
        customer: { id: customerId },
      },
    });
  }

  async create(data: CreateOrderDto) {
    const order = new Order();
    if (data.customerId) {
      const customer = await this.customerRepo.findOne({
        where: {
          id: data.customerId,
        },
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id: id });
    if (changes.customerId) {
      const customer = await this.customerRepo.findOne({
        where: {
          id: changes.customerId,
        },
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }
}

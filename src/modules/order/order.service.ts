import { Injectable, Inject } from "@nestjs/common";
import { OrderRepository } from "./repository/order.repository";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/CreateOrderDto";
import { User } from "../user/entitty/user.entity";
import { GetOrderInput, GetOrderOutput } from "./dtos/getMyOrderDto";
import { GetOrdersOutput, GetOrdersInput } from "./dtos/getAllOrdersDto";
import { EditOrderOutput, EditOrderInput } from "./dtos/editOrderDto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/taskeOrderDto";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async createOrder(owner: User, args: CreateOrderInput): Promise<CreateOrderOutput> {
    return this.orderRepo.createOrder(owner, args);
  }
  async gteOrders(owner: User, args: GetOrdersInput): Promise<GetOrdersOutput> {
    return this.orderRepo.gteOrders(owner, args);
  }

  async gteOrder(owner: User, args: GetOrderInput): Promise<GetOrderOutput> {
    return this.orderRepo.gteOrder(owner, args);
  }

  async editOrder(owner: User, args: EditOrderInput): Promise<EditOrderOutput> {
    return this.orderRepo.editOrder(owner, args);
  }

  async takeOrder(driver: User, args: TakeOrderInput): Promise<TakeOrderOutput> {
    return this.orderRepo.takeOrder(driver, args);
  }
}

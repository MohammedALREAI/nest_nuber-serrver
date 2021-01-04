import { Resolver, Mutation, Args, Query, Subscription } from "@nestjs/graphql";
import { OrderService } from "./order.service";
import { Order } from "./entity/order.entity";
import { User } from "../user/entitty/user.entity";
import { Role } from "../../common/decorator/role.decorator";
import { AuthUser } from "../../common/decorator/auth.decorator";
import { GetOrderOutput, GetOrderInput } from "./dtos/getMyOrderDto";
import { GetOrdersOutput, GetOrdersInput } from "./dtos/getAllOrdersDto";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/CreateOrderDto";
import { EditOrderOutput, EditOrderInput } from "./dtos/editOrderDto";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionOrder } from "./enum/subscribtion";
import { OrderUpdatesInput } from "./dtos/updateOrderDto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/taskeOrderDto";

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject() private readonly pubSub: PubSub,
  ) {}

  /***
   * ccreate Order
   * @Prams CreateOrderInputDto
   * @retaurn CreateOrderOutputDto
   */
  @Mutation(() => CreateOrderOutput)
  @Role(["CLIENT"])
  async createOrder(
    @AuthUser() owner: User,
    @Args() args: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(owner, args);
  }

  @Mutation(() => CreateOrderOutput)
  @Role(["Owner"])
  async CreateOrder(
    @AuthUser() owner: User,
    @Args() args: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return await this.orderService.createOrder(owner, args);
  }

  @Query(() => GetOrdersOutput)
  @Role(["Any"])
  async gteOrders(@AuthUser() owner: User, @Args() args: GetOrdersInput): Promise<GetOrdersOutput> {
    return this.orderService.gteOrders(owner, args);
  }
  @Query(() => GetOrderOutput)
  @Role(["Any"])
  async gteOrder(@AuthUser() owner: User, @Args() args: GetOrderInput): Promise<GetOrderOutput> {
    return this.orderService.gteOrder(owner, args);
  }

  @Query(() => EditOrderOutput)
  @Role(["Any"])
  async editOrder(@AuthUser() owner: User, @Args() args: EditOrderInput): Promise<EditOrderOutput> {
    return this.orderService.gteOrder(owner, args);
  }

  @Subscription(() => Order)
  @Role(["DELIVERY"])
  cookedOrder() {
    return this.pubSub.asyncIterator(SubscriptionOrder.NEW_COOKED_ORDER);
  }

  @Subscription(() => Order, {
    filter: ({ pendingOrder: { ownerId } }, _, { user }) => {
      return ownerId === user.id;
    },
  })
  @Role(["Owner"])
  pendingOrder() {
    return this.pubSub.asyncIterator(SubscriptionOrder.NEW_PENDING_ORDER);
  }

  @Subscription(() => Order, {
    filter: (
      { orderUpdate: order }: { orderUpdate: Order },
      { args }: { args: OrderUpdatesInput },
      { user }: { user: User },
    ) => {
      const condition =
        order.driverId !== user.id &&
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id;
      if (condition) return false;
      return order.id === args.id;
    },
  })
  @Role(["Any"])
  orderUpdate(@Args() args: OrderUpdatesInput) {
    return this.pubSub.asyncIterator(SubscriptionOrder.NEW_ORDER_UPDATE);
  }
  @Mutation(() => TakeOrderOutput)
  @Role(["DELIVERY"])
  takeOrder(@AuthUser() user: User, @Args() args: TakeOrderInput): Promise<TakeOrderOutput> {
    return this.orderService.takeOrder(user, args);
  }
}

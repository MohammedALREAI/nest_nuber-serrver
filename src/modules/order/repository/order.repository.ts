import { Order } from "../entity/order.entity";
import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { User } from "../../user/entitty/user.entity";
import { RestaurantRepository } from "../../restaurants/Repository/restaurants.repository";
import { OrderItem } from "../entity/OrderItem.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DishRepository } from "../../dish/Repository/dish.Repostory";
import { CreateOrderInput, CreateOrderOutput } from "../dtos/CreateOrderDto";
import { GetOrderInput, GetOrderOutput } from "../dtos/getMyOrderDto";
import { UserType } from "src/modules/user/enum/IUserType";
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { GetOrdersInput, GetOrdersOutput } from "../dtos/getAllOrdersDto";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";
import { EditOrderInput, EditOrderOutput } from "../dtos/editOrderDto";
import { ErrOrderEnum } from "../enum/handleErrorOrder";
import { OrderStatus } from "../enum/EnumOrderStaus";
import { Inject } from "@nestjs/common";
import { PUB_SUB } from "../../../common/common.constat";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionOrder } from "../enum/subscribtion";
import { TakeOrderOutput, TakeOrderInput } from "../dtos/taskeOrderDto";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  constructor(
    private readonly restaurantRepo: RestaurantRepository,
    @InjectRepository(OrderItem) private readonly orderItem: Repository<OrderItem>,
    private readonly dishRepo: DishRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    super();
  }

  async editOrder(owner: User, args: EditOrderInput): Promise<EditOrderOutput> {
    const { id, status } = args;

    const { order, error, ok } = await this.findOneOrder(id);
    if (!order || ok === false || error) {
      return {
        ok,
        error,
      };
    }
    if (!this.canSeeOrder(owner, order)) {
      return {
        ok: false,
        error: ErrOrderEnum.CANT_ACCESS,
      };
    }
    let canEdit = true;
    if (owner.role === UserType.CLIENT) {
      canEdit = false;
    }

    if (owner.role === UserType.Owner) {
      if (status !== OrderStatus.Cooked && status !== OrderStatus.Cooking) {
        canEdit = false;
      }
    }
    if (owner.role === UserType.DELIVERY) {
      if (status !== OrderStatus.Delivered && status !== OrderStatus.PickedUp) {
        canEdit = false;
      }
    }
    if (!canEdit) {
      return {
        error: ErrOrderEnum.CANT_ACCESS,
        ok: false,
      };
    }
    try {
      await this.save(this.create({ id, status }));
      const newOrder = { ...order, status };
      if (owner.role === UserType.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(SubscriptionOrder.NEW_COOKED_ORDER, {
            cookedOrders: newOrder,
          });
        }
      }
      await this.pubSub.publish(SubscriptionOrder.NEW_ORDER_UPDATE, { orderUpdate: newOrder });
      return {
        ok: true,
      };
    } catch (e) {
      throw new InternalServerErrorException(`there is some issie to handle with the order`);
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let isSeeForYou = false;
    const con = user.role === UserType.CLIENT && order.customerId !== user.id;
    if (con) isSeeForYou = true;

    const condition: boolean = user.role === UserType.DELIVERY && order.driverId !== user.id;
    if (condition) isSeeForYou = false;

    const condat = user.role === UserType.Owner && order.restaurant.ownerId !== user.id;
    if (condat) isSeeForYou = false;

    return isSeeForYou;
  }

  async findOneOrder(id: string, condition?: any): Promise<GetOrderOutput> {
    try {
      const order = await this.findOne({
        id,
        ...(condition && { condition }),
      });
      if (!order) {
        return {
          ok: false,
          error: ErrOrderEnum.ITEM_NOT_FOUND as string,
        };
      }
      return {
        ok: true,
        order,
      };
    } catch (e) {
      throw new BadRequestException(`${ErrOrderEnum.ITEM_NOT_FOUND} =>${e}`);
    }
  }

  async createOrder(customer: User, args: CreateOrderInput): Promise<CreateOrderOutput> {
    const { items, restaurantId } = args;
    const { ok, error, restaurant } = await this.restaurantRepo.findOneById(restaurantId);
    // this meaing there is no items and there is error
    if (ok === false || error || !restaurant) {
      return {
        ok,
        error,
      };
    }
    for (const item of items) {
      const { dish, error, ok } = await this.dishRepo.findOneDish(item.dishId);

      if (!dish) {
        return { ok, error };
      }
      let dishFinalPrice = dish.price;
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const itemOptions of item.options) {
        const dishOption = dish.options.find(dishOptions => dishOptions.name === itemOptions.name);
        if (dishOption) {
          if (dishOption.extra) {
            dishFinalPrice = dishFinalPrice + dishOption.extra;
          } else {
            const dishOptionChoice = dishOption.choices.find(op => op.name === itemOptions.choice);
            if (dishOptionChoice) {
              dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
            }
          }
        }
      }
      orderFinalPrice = orderFinalPrice + dishFinalPrice;

      const orderItem = await this.orderItem.save(
        this.orderItem.create({
          dish,
          options: item.options,
        }),
      );
      orderItems.push(orderItem);
      const myOrder = await this.save(
        this.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
    }
    await this.pubSub.publish(SubscriptionOrder.NEW_PENDING_ORDER, {
      pendingOrder: { myOrder, ownerId: restaurant.ownerId },
    });
    return {
      ok: true,
    };
  }

  /****
   *gteOrders()
   *@parms owner
   *@parms =>GetOrdersInput
   * @reaturn =>GetOrdersOutput
   * ***/

  async gteOrders(owner: User, args: GetOrdersInput): Promise<GetOrdersOutput> {
    const { status } = args;
    let orders: Order[];
    let condition: FindManyOptions<Restaurants | Order> = {};
    try {
      if (owner.role === UserType.CLIENT) {
        condition = {
          where: {
            driver: owner,
            ...(status && { status }),
          },
        };
        orders = await this.find(condition);
      }
      if (owner.role === UserType.DELIVERY) {
        condition = {
          where: {
            owner,
            ...(status && { status }),
          },
          relations: ["orders"],
        };
        orders = await this.find(condition);
      } else if (owner.role === UserType.Owner) {
        condition = {
          where: { owner },
          relations: ["orders"],
        };
        const restaurants = await this.restaurantRepo.find(condition);

        if (!restaurants) {
          throw new NotFoundException("there isn no iten like this");
        }
        if (status) {
          orders = restaurants.map(res => res.orders).flat(1);
          orders = orders.filter(item => item.status === status);
        }
      }

      return {
        ok: true,
        orders,
      };
    } catch (e) {
      throw new InternalServerErrorException(`there are some issuie to handle this gets ${e}`);
    }
  }

  /****
   *gteOrder()
   *@parms owner
   *@parms =>GetOrderInput
   * @reaturn =>GetOrderOutput
   * ***/

  async gteOrder(owner: User, args: GetOrderInput): Promise<GetOrderOutput> {
    const { id } = args;
    try {
      const { ok, error, order } = await this.findOneOrder(id, { relations: ["restaurant"] });
      if (!order || ok === false || error) {
        return {
          ok,
          error,
        };
      }
      if (!this.canSeeOrder(owner, order)) {
        return {
          ok: false,
          error: ErrOrderEnum.CANT_ACCESS,
        };
      }

      return {
        ok: true,
        order,
      };
    } catch (e) {
      throw new BadRequestException(`${ErrOrderEnum.CANT_ACCESS} =>${e}`);
    }
  }

  async takeOrder(driver: User, args: TakeOrderInput): Promise<TakeOrderOutput> {
    const { id } = args;
    const { order, error, ok } = await this.findOneOrder(id);
    if (!order || error || ok === false) {
      return {
        ok,
        error,
      };
    }
    if (order.driver) {
      return { ok: false, error: `this order have the driver` };
    }
    try {
      await this.save(
        this.create({
          id: order.id,
          driver,
        }),
      );
      try {
        await this.pubSub.publish(SubscriptionOrder.NEW_ORDER_UPDATE, {
          orderUpdate: { ...order, driver },
        });
        return { ok: true };
      } catch (e) {
        throw new InternalServerErrorException(`There are the ${e}`);
      }
    } catch (e) {
      throw new InternalServerErrorException(`There are the ${e}`);
    }
  }
}

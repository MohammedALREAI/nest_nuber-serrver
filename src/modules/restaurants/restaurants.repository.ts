import { Restaurants } from "./entity/restaurants.entity";
import { EntityRepository, Repository } from "typeorm";
import { IRestaurant } from "./interface/IRestaurant";
import { createRestaurantDto } from "./dtos/createRestaurantDto";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

@EntityRepository(Restaurants)
export class RestaurantRepository extends Repository<Restaurants> implements IRestaurant {
  constructor() {
    super();
  }
  async restaurants(): Promise<Restaurants[]> {
    try {
      const res = await this.find({});
      if (!res) {
        throw new NotFoundException(" there is no item like that ");
      }
      return res;
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie");
    }
  }

  async findById(id: string): Promise<Restaurants> {
    try {
      const res = await this.findById(id);

      if (!res) {
        throw new NotFoundException(" there is no item like that ");
      }
      return res;
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie");
    }
  }
  async createRestaurant(args: createRestaurantDto): Promise<Restaurants> {
    try {
      const res = this.create(args);

      return await res.save();
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie createRestaurant");
    }
  }
}

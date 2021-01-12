import { Verification } from "../entities/verification.entity";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Verification)
export class VerificationRepository extends Repository<Verification> {
  constructor() {
    super();
  }
}

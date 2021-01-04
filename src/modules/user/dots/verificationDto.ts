import { MutationOutput } from "../../../common/dto/MutationOutput";
import { ObjectType, InputType, PickType } from "@nestjs/graphql";
import { Verification } from "../entitty/verification.entity";

@InputType()
export class verificationInputMutation extends PickType(Verification, ["code"]) {}

@ObjectType()
export class verificationOutputMutation extends MutationOutput {}

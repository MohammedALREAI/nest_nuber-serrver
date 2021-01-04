import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";

let userService: UserService;

describe("user service testin in hear", async () => {
  //ceate user service
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = (await module).get<UserService>(UserService);
  });

  /*****
   *
   * cheack service is defind
   */
  it("it should be define", () => {
    expect(userService).toBeDefined();
  });
});

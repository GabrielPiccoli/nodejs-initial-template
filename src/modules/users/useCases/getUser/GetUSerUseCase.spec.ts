import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { GetUserUseCase } from "./GetUserUseCase";

let usersRepositoryInMemory: IUsersRepository;
let getUserUseCase: GetUserUseCase;

describe("Get User (me)", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    getUserUseCase = new GetUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to get a user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    });

    const userMe = await getUserUseCase.execute(user.id);

    expect(userMe.name).toBe("John Doe");
  });

  it("should not be able to get a user non exists", async () => {
    await expect(getUserUseCase.execute("1234")).rejects.toEqual(
      new AppError("User does not exists")
    );
  });
});

import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { ListUsersUseCase } from "./ListUsersUseCase";

let usersRepositoryInMemory: IUsersRepository;
let listUsersUseCase: ListUsersUseCase;

describe("List Users", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    listUsersUseCase = new ListUsersUseCase(usersRepositoryInMemory);
  });

  it("should be able to list all users", async () => {
    await usersRepositoryInMemory.create({
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    });
    const users = await listUsersUseCase.execute();

    expect(users).toHaveLength(1);
  });
});

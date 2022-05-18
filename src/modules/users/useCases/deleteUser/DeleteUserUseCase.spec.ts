import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { DeleteUserUseCase } from "./DeleteUserUseCase";

let usersRepositoryInMemory: IUsersRepository;
let deleteUserUseCase: DeleteUserUseCase;

describe("Delete User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to delete a user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "john.doe2@test.com",
      name: "John Doe2",
      password: "12345",
      username: "john",
    });
    await deleteUserUseCase.execute(user.id);
    const users = await usersRepositoryInMemory.list();

    expect(users.length).toBe(0);
  });

  it("should not be able to delete a non exists user", async () => {
    await expect(deleteUserUseCase.execute("1234")).rejects.toEqual(
      new AppError("User does not exists")
    );
  });
});

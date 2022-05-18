import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { UpdateUserUseCase } from "./UpdateUserUseCase";

let usersRepositoryInMemory: IUsersRepository;
let updateUserUseCase: UpdateUserUseCase;

describe("Update User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    updateUserUseCase = new UpdateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to update a user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    });

    const updatedUser = await updateUserUseCase.execute({
      email: "john.doe@test.com",
      name: "John Doe Updated",
      password: "1234",
      username: "john",
      id: user.id,
    });

    expect(updatedUser.name).toEqual("John Doe Updated");
  });

  it("should not be able to update a non exists user", async () => {
    await expect(
      updateUserUseCase.execute({
        email: "john.doe@test.com",
        name: "John Doe Updated",
        password: "1234",
        username: "john",
        id: "12345",
      })
    ).rejects.toEqual(new AppError("User does not exists"));
  });
});

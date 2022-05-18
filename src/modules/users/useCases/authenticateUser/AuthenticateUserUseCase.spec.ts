import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/users/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let dateProvider: IDateProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      username: user.username,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a non exists user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        username: "admin",
        password: "admin",
      })
    ).rejects.toEqual(new AppError("User or password incorrect"));
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const user: ICreateUserDTO = {
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    };
    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        username: user.username,
        password: "admin",
      })
    ).rejects.toEqual(new AppError("User or password incorrect"));
  });
});

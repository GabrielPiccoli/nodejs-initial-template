import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/users/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/users/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let dateProvider: IDateProvider;
let refreshTokenUseCase: RefreshTokenUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Refresh User Token", () => {
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
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepositoryInMemory,
      dateProvider
    );
  });

  it("should be able to refresh a user token", async () => {
    const user: ICreateUserDTO = {
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    };
    await createUserUseCase.execute(user);

    const { refresh_token } = await authenticateUserUseCase.execute({
      username: user.username,
      password: user.password,
    });
    const result = await refreshTokenUseCase.execute(refresh_token);

    expect(result).toHaveProperty("token");
  });

  it("should not be able to refresh a non exists user token", async () => {
    const user: ICreateUserDTO = {
      email: "john.doe@test.com",
      name: "John Doe",
      password: "1234",
      username: "john",
    };
    await createUserUseCase.execute(user);

    const { refresh_token } = await authenticateUserUseCase.execute({
      username: user.username,
      password: user.password,
    });

    const userToken = await usersTokensRepositoryInMemory.findByRefreshToken(
      refresh_token
    );

    await usersTokensRepositoryInMemory.deleteById(userToken.id);

    await expect(refreshTokenUseCase.execute(refresh_token)).rejects.toEqual(
      new AppError("Refresh token does not exists")
    );
  });
});

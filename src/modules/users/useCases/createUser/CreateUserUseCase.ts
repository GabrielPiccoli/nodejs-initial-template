import { hash } from "bcryptjs";
import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    email,
    name,
    password,
    username,
  }: ICreateUserDTO): Promise<User> {
    const usernameAlreadyExists = await this.usersRepository.findByUsername(
      username
    );

    if (usernameAlreadyExists) {
      throw new AppError("Username already exists");
    }

    const passwordHash = await hash(password, 8);
    const user = await this.usersRepository.create({
      email,
      name,
      password: passwordHash,
      username,
    });
    const userTreated = instanceToPlain(user) as User;

    return userTreated;
  }
}

export { CreateUserUseCase };

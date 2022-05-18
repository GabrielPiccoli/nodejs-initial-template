import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class GetUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<User> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const user = instanceToPlain(userExists) as User;
    return user;
  }
}

export { GetUserUseCase };

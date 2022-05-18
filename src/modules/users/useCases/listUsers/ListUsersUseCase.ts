import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

@injectable()
class ListUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<User[]> {
    const all = await this.usersRepository.list();
    const users = instanceToPlain(all) as User[];

    return users;
  }
}

export { ListUsersUseCase };

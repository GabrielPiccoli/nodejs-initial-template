import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/infra/typeorm/entities/User";

import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    email,
    name,
    password,
    username,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      email,
      name,
      password,
      username,
    });

    this.users.push(user);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = this.users.find((user) => user.username === username);
    return user;
  }

  async list(): Promise<User[]> {
    const all = this.users;
    return all;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  async deleteById(id: string): Promise<void> {
    const user = await this.findById(id);
    const indexOfUser = this.users.indexOf(user);
    this.users.splice(indexOfUser, 1);
  }
}

export { UsersRepositoryInMemory };

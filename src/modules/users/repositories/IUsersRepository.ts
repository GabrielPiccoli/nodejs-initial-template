import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  list(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  deleteById(id: string): Promise<void>;
}

export { IUsersRepository };

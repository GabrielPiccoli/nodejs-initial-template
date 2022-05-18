import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const { email, name, password, username } = req.body;
    const user = await createUserUseCase.execute({
      email,
      name,
      password,
      username,
    });

    return res.status(201).json(user);
  }
}

export { CreateUserController };

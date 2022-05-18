import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    const { id } = req.params;
    const { email, name, password, username } = req.body;
    const user = await updateUserUseCase.execute({
      id,
      email,
      name,
      password,
      username,
    });

    return res.json(user);
  }
}

export { UpdateUserController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetUserUseCase } from "./GetUserUseCase";

class GetUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const getUserUseCase = container.resolve(GetUserUseCase);
    const user = await getUserUseCase.execute(id);

    return res.json(user);
  }
}

export { GetUserController };

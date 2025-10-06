import type { Request, Response } from "express";
import { createUserSchema } from "../dtos/user.dto.js";
import { AppError } from "../errors/AppError.js";
import { UsersService } from "../services/users.service.js";

const usersService = new UsersService();

export class UsersController {
  async create(req: Request, res: Response) {
    const userData = createUserSchema.parse(req.body);
    const user = await usersService.create(userData);
    return res.status(201).json(user);
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.user.id;
    const user = await usersService.findById(userId);

    if (!user) {
      // Este caso é improvável se o token for válido, mas é bom para robustez
      throw new AppError("Usuário não encontrado.", 404);
    }

    return res.json(user);
  }
}

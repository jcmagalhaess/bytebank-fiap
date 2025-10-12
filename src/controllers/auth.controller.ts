import type { Request, Response } from "express";
import { loginUserSchema } from "../dtos/user.dto.js";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, senha } = loginUserSchema.parse(req.body);
    const result = await authService.login({ email, senha });
    return res.json(result);
  }
}

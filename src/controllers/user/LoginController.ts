import { Request, Response } from "express";
import { RegisterProps, SignInProps } from "../../interfaces/loginProps";
import LoginService from "../../services/user/LoginService";

class LoginController {
  async register(req: Request, res: Response) {
    const { name, lastName, email, password } = req.body as RegisterProps;
    const response = await LoginService.register({
      name,
      lastName,
      email,
      password,
    });
    return res.status(201).json(response);
  }

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body as SignInProps;
    const response = await LoginService.signIn({ email, password });
    return res.status(200).json(response);
  }

  async getUser(req: Request, res: Response) {
    const req_id = req.user_id;

    const response = await LoginService.getUser(req_id);
    return res.status(200).json(response);
  }
}

export default new LoginController();

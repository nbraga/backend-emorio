import { Router, Request, Response } from "express";
import LoginController from "./controllers/user/LoginController";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

router.get("/teste", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Rota de API online" });
});

//USERS
router.post("/register", LoginController.register);
router.post("/login", LoginController.signIn);
router.get("/getUser", isAuthenticated, LoginController.getUser);

export { router };

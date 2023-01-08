import { RegisterProps, SignInProps } from "../../interfaces/loginProps";
import prismaClient from "../../prisma";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

class LoginService {
  async register({ name, lastName, email, password }: RegisterProps) {
    if (!email) {
      throw new Error("Email obrigatório");
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já cadastrado!");
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        lastName: lastName,
        email: email,
        password: passwordHash,
      },
      select: {
        name: true,
        lastName: true,
        email: true,
      },
    });

    return { user: user, message: "Usuário cadastrado com sucesso!" };
  }

  async signIn({ email, password }: SignInProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Usuário ou senha incorreto!");
    }
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Usuário ou senha incorreto!");
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JTW_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      },
      token: token,
      message: "Seja bem vindo(a), aproveite todos os recursos disponíveis!",
    };
  }

  async getUser(user_id: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error("Erro ao buscar usuário!");
    }

    if (user === null) {
      throw new Error("Usuário não existe!");
    }

    return user;
  }
}

export default new LoginService();

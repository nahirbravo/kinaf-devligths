import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({ success: true, token, data: { user } });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.create({ email, password, firstName, lastName });
    createSendToken(user, 201, res);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error registrando usuario", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, message: "Error en login", error });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    let token;
    if (req.headers.cookie) {
      const cookies = req.headers.cookie
        .split(";")
        .reduce((acc: any, cookie) => {
          const [key, val] = cookie.trim().split("=");
          acc[key] = val;
          return acc;
        }, {});
      token = cookies.jwt;
    }

    if (!token)
      return res.status(401).json({ success: false, message: "No logueado" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Usuario no existe" });

    res.json({ success: true, data: { user } });
  } catch (e) {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true });
};

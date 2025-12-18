import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc: any, cookie) => {
      const [key, val] = cookie.trim().split("=");
      acc[key] = val;
      return acc;
    }, {});
    token = cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "No estás logueado. Por favor inicia sesión.",
      });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "El usuario de este token ya no existe.",
        });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido." });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción.",
      });
    }
    next();
  };
};

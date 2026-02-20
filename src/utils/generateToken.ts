import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response): string => {
  const payload = { id: userId };
  const secret = (process.env.JWT_SECRET || "fallback_secret") as jwt.Secret;
  const token = jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
  });

  res.cookie("jwt", token, {
    httpOnly: true, // so that javascript can't access this cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // stops the browser from sending this cookie on cross-site request which prevents CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
  });
  return token;
};

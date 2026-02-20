import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { User } from "../types/index.js";

interface DecodedToken {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  console.log("auth", req?.headers?.authorization);
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies?.jwt;
  }

  if (!token) {
    console.log("No token found in headers or cookies");
    return res.status(401).json({
      error: "Not authorized, no token provided!",
    });
  }
  try {
    // verify that the token is valid and extract the user id
    const secret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, secret) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        error: "User no longer exists!",
      });
    }

    req.user = user as User;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Not authorized, token failed!",
    });
  }
};

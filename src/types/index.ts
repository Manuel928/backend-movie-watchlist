import { Request } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

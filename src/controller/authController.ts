import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// --------------- Register ---------------------
const register = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: "All fields (name, email, password) are required",
    });
  }

  // check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({
      error: `User already exists with this email (${email})`,
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate a JWT token
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
};

// ------------------- Login --------------------------
const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;

  // Check if the user exists in the table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials. Email or Password doesn't exist.",
    });
  }

  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid credentials. Email or Password doesn't exist.",
    });
  }

  // Generate a JWT token
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    },
  });
};

// -------------- Logout ----------------
const logout = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };

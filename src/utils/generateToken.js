import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // so that javascript can't access this cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // stops the browser from sending this cookie on cross-site request which prevents CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
  });
  return token;
};

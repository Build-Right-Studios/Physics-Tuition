import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

const SECRET = process.env.JWT_SECRET || JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const generateToken = async  (payload) => {
  if (!payload) {
    throw new Error("Token payload is required");
  }

  return jwt.sign(
    payload,
    SECRET,
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required for verification");
  }

  return jwt.verify(token, SECRET);
};

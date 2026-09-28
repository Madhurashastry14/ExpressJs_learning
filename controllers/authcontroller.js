import { createUser, getUserByEmail } from "../services/authservice.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const createUsers = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: "Enter valid name,email,password",
      });
    }
    const user = await createUser(
      name.trim(),
      email.trim().toLowerCase(),
      password,
    );
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const findUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password === ""
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }
    const user = await getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const checkpassword = await bcrypt.compare(password, user.password_hash);
    if (!checkpassword) {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { userId: user.id, userName: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

//GET /profile
export const getProfile = async (req, res, next) => {
  try {
    if (req.user.userId !== req.params.userId) {
      json.status(403).json({
        error: "Forbidden",
      });
    }
    const userId = req.user.userId;
    res.status(200).json({
      message: "Authentication successful",
      userId,
    });
  } catch (error) {
    next(error);
  }
};

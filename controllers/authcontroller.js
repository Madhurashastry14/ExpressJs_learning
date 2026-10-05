import { createUser, getUserByEmail } from "../services/authservice.js";
import {
  generateRefreshToken,
  hashRefreshToken,
  saveRefreshToken,
  rotateRefreshToken,
} from "../services/refreshtoken.js";
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
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const checkpassword = await bcrypt.compare(password, user.password_hash);
    if (!checkpassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const accessToken = jwt.sign(
      { userId: user.id, userName: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7 days
    const saved = await saveRefreshToken(user.id, tokenHash, expiresAt);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
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
    if (req.params.userId !== req.params.userId) {
      return res.status(403).json({
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

export const logout = async (req, res, next) => {
  try {
    const refreshtoken = req.cookies.refreshToken;
    if (refreshtoken) {
      const tokenhash = hashRefreshToken(refreshtoken);
      await revokeRefreshToken(tokenhash);
    }
    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const oldrefreshToken = req.cookies.refreshToken;
    if (!oldrefreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
      });
    }
    const oldHashToken = hashRefreshToken(oldrefreshToken);
    const newRefreshToken = generateRefreshToken();
    const newHashToken = hashRefreshToken(newRefreshToken);

    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const storedToken = await rotateRefreshToken(
      oldHashToken,
      newHashToken,
      newExpiresAt,
    );
    const accessToken = jwt.sign(
      {
        userId: storedToken.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

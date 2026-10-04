import { Router } from "express";
import {
  createUsers,
  findUser,
  getProfile,
  refreshAccessToken,
  logout,
} from "../controllers/authcontroller.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

const router = new Router();
router.post("/register", createUsers);
router.post("/login", findUser);
router.get("/profile", authenticateUser, getProfile);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
export default router;

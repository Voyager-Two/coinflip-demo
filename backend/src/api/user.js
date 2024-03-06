import express from "express";
import login from "./user-login.js";
import signup from "./user-signup.js";
import changePassword from "./user-change-password.js";
import auth from "../utils/auth.js";
import userWager from "./user-wager.js";
import userData from "./user-data.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

// Authenticated Routes
router.post("/changePassword", auth, changePassword);
router.post("/wager", auth, userWager);
router.get("/data", auth, userData);

export default router;

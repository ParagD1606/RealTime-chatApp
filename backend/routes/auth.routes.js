import express from "express"
import { signup, login } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", protect, logout);

router.get("/test", (req,res)=>{
  res.send("OK");
})


router.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.user.userId, email: req.user.email });
});

export default router
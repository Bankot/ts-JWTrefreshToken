import express, { Request, Response, NextFunction } from "express"
import protectedRoute from "../middleware/auth"
import {
	loginController,
	signupController,
	refreshToken,
} from "../controllers/userController"

const router = express.Router()

router.route("/login").post(loginController)
router.route("/signup").post(signupController)
router.route("/refreshToken").get(refreshToken)
router
	.route("/protected")
	.get(protectedRoute, (req: Request, res: Response, next: NextFunction) => {
		res.send("Huh! That's a protected piece of cake!")
	})

export default router

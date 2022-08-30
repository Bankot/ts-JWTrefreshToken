import express from "express"
import {
	loginController,
	signupController,
} from "../controllers/userController"

const router = express.Router()

router.route("/login").post(loginController)
router.route("/signup").post(signupController)

export default router

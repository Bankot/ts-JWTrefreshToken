import { Request, Response, NextFunction } from "express"
import { UserModel } from "../db/Models"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// first get props from the body
	const { email, password } = req.body
	// make sure props exists
	if (!email || !password) return res.send("Please provide all needed data!")

	//here we are gonna start all the logic about sessions, tokens etc.

	// first let's check if user exists
	let exists = await UserModel.findOne({ email: email })
	if (!exists) return res.send("Account for given email doesn't exist!")

	// ...
}

const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// first get props from the body
	const { email, password } = req.body
	// make sure props exists
	if (!email || !password)
		return res.status(400).send("Please provide all needed data!")

	//here we are gonna start all the logic about sessions, tokens etc.

	// first let's check if user for given email exists
	let exists = await UserModel.findOne({ email: email })
	if (exists)
		return res.status(400).send("Account for given email already exists!")

	await UserModel.create({
		email: email,
		password: await bcrypt.hash(password, 10),
	})
	res.send("Succesfully added a user!")
}

export { loginController, signupController }

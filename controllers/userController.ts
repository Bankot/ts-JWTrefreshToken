import { Request, Response, NextFunction } from "express"
import { UserModel } from "../db/Models"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose"
import dotenv from "dotenv"
import signJwt from "../utils/signJWT"
import cookieCreator from "../utils/addTokenCookies"
dotenv.config()

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
	let foundUser = await UserModel.findOne({ email: email })
	// check if foundUser exists
	if (!foundUser || !foundUser._id)
		return res.send("Account for given email doesn't exist!")
	// compare given password with password in database
	bcrypt.compare(password, foundUser.password, async (err, response) => {
		// i know it's not the best error handling but its enough for now
		if (err) return res.status(404).send(err)
		if (response) {
			// here we will send tokens
			// access token:
			const accessToken = signJwt.signAccessToken(foundUser!._id.toString())

			// refresh token:
			const refreshToken = signJwt.signRefreshToken(foundUser!._id.toString())

			if (!accessToken || !refreshToken) return res.send("Error occured!")

			// now we want to assign tokens to the
			cookieCreator.addAccessTokenCookie(res, accessToken)
			cookieCreator.addRefreshTokenCookie(res, refreshToken)

			// then we are replacing the refresh token in db
			// atm users can have only one refresh token but it could be also array of tokens
			// its more safe, but if I implemented way of recognizing which one is from what IP or something,
			// i could implement multiple tokens
			try {
				await UserModel.findOneAndUpdate(
					{ email: email },
					{ refreshToken: refreshToken }
				)
			} catch (error) {
				return res.status(400).send("Some error occured!")
			}

			return res.json({ accessToken })
		} else return res.status(400).send("Invalid password!")
	})
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

	//generate salt
	const salt = await bcrypt.genSalt(Number(process.env.SALT))
	// ofc we are gonna store hashed passwords in our db
	await UserModel.create({
		email: email,
		password: await bcrypt.hash(password, salt),
	})
	res.send("Succesfully added a user!")
	// then redirect to login page, or send request to /login
}
const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// check if user is sending cookie with refresh token
	if (!req.cookies.refreshToken) return res.status(401).send("Log in!")
	const { refreshToken } = req.cookies

	// check if this token is in user's record in DB (if he logs from somewhere else it won't be valid)

	let isValid = await UserModel.findOne({ refreshToken: refreshToken })
	// if theres no record for that token in db, redirect to login page
	if (!isValid)
		return res.status(401).send("This token isnt matching any logged in user!!")
	// if there is a record, let's verify if that's valid JWT refresh token
	jwt.verify(
		refreshToken,
		process.env.REFRESH_SECRET!,
		(error: any, decoded: any) => {
			// dummy error handler
			if (error) return res.status(400).send(error)
			// if that's not valid JWT, lets redirect to login page
			if (!decoded) return res.status(401).send("Please log in!")
			// finally if thats correct jwt, lets create a new access token, and push it to the browser as a cookie
			if (decoded._id) {
				let accessToken = signJwt.signAccessToken(decoded._id)
				if (accessToken) {
					cookieCreator.addAccessTokenCookie(res, accessToken)
					res.send({ status: "OK", msg: "Succesfully Logged in!", decoded })
				} else {
					// that's the case when jwt signing fails, try catch block in utils function should be upgraded in the future!
					res.status(400).send("Some error occured!")
				}
			}
		}
	)
}

export { loginController, signupController, refreshToken }

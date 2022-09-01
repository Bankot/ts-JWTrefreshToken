import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
	if (!req.cookies.accessToken) return res.status(401).send("Unathorized!")
	const { accessToken } = req.cookies
	try {
		jwt.verify(
			accessToken,
			process.env.ACCESS_SECRET!,
			(error: any, decoded: any) => {
				if (error) return res.status(400).send("Error during JWT verifying!")
				if (!decoded) return res.status(401).send("Unauthorized!")
				if (decoded._id) return next()
			}
		)
	} catch (error) {
		res.status(400).send("Error during JWT verifying!")
	}
}
export default protectedRoute

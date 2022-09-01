import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const signAccessToken = (_id: string) => {
	try {
		return jwt.sign({ _id }, process.env.ACCESS_SECRET!, { expiresIn: "5m" })
	} catch (error) {
		console.log(error)
	}
}
const signRefreshToken = (_id: string) => {
	try {
		return jwt.sign({ _id }, process.env.REFRESH_SECRET!, { expiresIn: "1y" })
	} catch (error) {
		console.log
	}
}
export default { signAccessToken, signRefreshToken }

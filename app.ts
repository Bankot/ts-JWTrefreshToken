import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import logger from "./logger/logger"
// setup env file
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
// add router

app.use("/api", userRouter)
mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => {
		app.listen(3000, () => console.log("Listening on port 3000..."))
	})
	.catch((err) =>
		logger.error(typeof err.message === "string" ? err.message : err)
	)

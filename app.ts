import express from "express"
import session from "express-session"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes"
import dotenv from "dotenv"
// that will be store for our session (maybe will switch to mongodb)
export const store = new session.MemoryStore()
// setup env file
dotenv.config()

const app = express()

app.use(express.json())

// add router

app.use("/api", userRouter)

// setup express session
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		cookie: { maxAge: 30000 },
		saveUninitialized: false,
		resave: false,
		store: store,
	})
)
mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => {
		app.listen(3000, () => console.log("Listening on port 3000..."))
	})
	.catch((error) => console.log(error))

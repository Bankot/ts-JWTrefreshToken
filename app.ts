import express from "express"
import session from "express-session"
export const store = new session.MemoryStore()

const app = express()
app.use(express.json())
app.use(
	session({
		secret: "Hello",
		cookie: { maxAge: 30000 },
		saveUninitialized: false,
		resave: false,
		store: store,
	})
)

app.listen(3000, () => console.log("Listening on port 3000..."))

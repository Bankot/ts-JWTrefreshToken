import { Request, Response, NextFunction } from "express"
import { store } from "./app"
export function authUser(req: Request, res: Response, next: NextFunction) {
	//@ts-ignore
	console.log(store.sessions[req.sessionID])
}

import { checkAuthenticated, checkAuthorzied } from "@modules/auth/backend";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

type AuthReq = NextApiRequest & {
	uid?: string;
};

export const authenticatedMiddleware = async (req: AuthReq, res: NextApiResponse, next: NextHandler) => {
	if (!req.headers.token) return res.status(401).json({ error: "please include the id token" });

	const [isAuthN, data] = await checkAuthenticated(req.headers.token as string);
	if (!isAuthN) {
		// user isn't authenticated
		return res.status(401).json({ error: "user is not authenticated" });
	} else {
		// user is authenticated
		req.uid = data as string;
		next();
	}
};

export const authorizedMiddleware = async (req: AuthReq, res: NextApiResponse, next: NextHandler) => {
	if (!req.headers.token) return res.status(401).json({ error: "please include the id token" });

	const [isAuthZ, ...data] = await checkAuthorzied(req.headers.token as string, req.body?.uid);

	if (!isAuthZ) {
		// user isn't authorized
		const [errCode, errMsg] = data as [number, string];
		return res.status(errCode).json({ error: errMsg });
	} else {
		// user is authorized
		const [uid] = data as [string];
		req.uid = uid;
		next();
	}
};

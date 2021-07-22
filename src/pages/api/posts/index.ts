import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();

handler
.get((req, res) => {
	// pass
})
.post((req, res) => {
	// pass
});
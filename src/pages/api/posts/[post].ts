import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();

handler
.get((req, res) => {
	// pass
})
.put((req, res) => {
	// pass
})
.delete((req, res) => {
	// pass
});
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import initDB from "@helpers/db";

const handler = nc<NextApiRequest, NextApiResponse>();

handler
.get(async (req, res) => {
	const { post } = req.query;

	const db = initDB();
	await db.collection('posts').where("slug", "==", post)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) return res.status(404).json({ error: "post not found"});

			res.status(200).json({ ...snapshot.docs[0].data() });
		})
		.catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
			return null;
		});
})
.put(async (req, res) => {
	const { post } = req.query;

	const db = initDB();
	const id = await db.collection('posts').where("slug", "==", post)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) {
				res.status(404).json({ error: "post not found"});
				return null;
			}
			return snapshot.docs[0].id;
		})
		.catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
			return null;
		});
	
	if (id) {
		await db.collection('posts').doc(id)
		.set({
			...req.body
		}, { merge: true })
		.then(() => {
			res.status(200).json({ ...req.body });
		});
	}
})
.delete(async (req, res) => {
	const { post } = req.query;

	const db = initDB();
	const id = await db.collection('posts').where("slug", "==", post)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) {
				res.status(404).json({ error: "post not found"});
				return null;
			}
			return snapshot.docs[0].id;
		})
		.catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
			return null;
		});
	
	if (id) {
		db.collection('posts').doc(id).delete().then(() => {
			res.status(200).json({ message: "document successfully deleted" });
		}).catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
		});
	}
});

export default handler;
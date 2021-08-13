import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { initDB } from "@helpers/firebase";
import slugify from "slugify";

const handler = nc<NextApiRequest, NextApiResponse>();

handler
.get(async (req, res) => {
	const db = initDB();
	await db.collection('posts')
		.get()
		.then((snapshot) => {
			const postsData = snapshot.docs.map(post => post.data());
			res.status(200).json(postsData);
		})
		.catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
		});
})
.post(async (req, res) => {
	const { title } = req.body;
	const slug = slugify(title, { lower: true });

	const db = initDB();

	db.runTransaction((transaction) => {
		const postsRef = db.collection('posts');
		return transaction
			.get(postsRef)
			.then((snapshot) => {
				const postsData = snapshot.docs.map(post => post.data())

				if (postsData.some(post => post.slug === slug))
					res.status(409).json({ error: "a post with that name already exists" });
				else {
					const { serverTimeStamp } = require("firebase-admin").FieldValue; // timestamp
					const requestData = { ...req.body, slug, created: serverTimeStamp() };

					const newPostRef = db.collection('posts').doc();

					transaction.set(newPostRef, requestData);
					res.status(200).json(requestData);
				}
			})
			.then(() => {
				console.log("add post: transaction finished successfully");
			})
			.catch((error) => {
				console.error("posts: error in transaction: ", error);
				res.status(400).json({ error: `something went wrong: ${error}` });
			});
	})
});

export default handler;
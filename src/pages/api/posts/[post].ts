import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { initDB } from "@helpers/firebase";
import slugify from "slugify";

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

	db.runTransaction((transaction) => {
		const postRef = db.collection('posts').where("slug", "==", post)
		return transaction
			.get(postRef)
			.then((snapshot) => {
				if (snapshot.empty) return res.status(404).json({ error: "post not found"});
				else {
					const docToUpdate = { slug: snapshot.docs[0].data().slug, id: snapshot.docs[0].id };
					const updateRef = db.collection('posts').doc(docToUpdate.id);

					const { serverTimeStamp } = require("firebase-admin").FieldValue; // timestamp
					const newDoc = {
						...req.body,
						slug: req.body.title ? slugify(req.body.title) : docToUpdate.slug,
						updated: serverTimeStamp()
					};

					transaction.set(updateRef, newDoc);
					res.status(200).json(newDoc);
				}
			})
			.then(() => {
				console.log("update post: transaction finished successfully")
			})
			.catch((error) => {
				console.error("update post: error in transaction: ", error);
				res.status(400).json({ error: `something went wrong: ${error}` });
			});
	})
})
.delete(async (req, res) => {
	const { post } = req.query;

	const db = initDB();

	db.runTransaction((transaction) => {
		const postRef = db.collection('posts').where("slug", "==", post)
		return transaction
			.get(postRef)
			.then((snapshot) => {
				if (snapshot.empty) return res.status(404).json({ error: "post not found"});
				else {
					const deleteDoc = snapshot.docs[0];

					db.collection('posts')
						.doc(deleteDoc.id)
						.delete()
						.then(() => {
							res.status(200).json({ message: "document successfully deleted" });
						})
						.catch((error) => {
							res.status(400).json({ error: `something went wrong: ${error}` });
						});
				}
			})
			.then(() => {
				console.log("delete post: transaction finished successfully")
			})
			.catch((error) => {
				console.error("delete post: error in transaction: ", error);
				res.status(400).json({ error: `something went wrong: ${error}` });
			});
	})
});

export default handler;
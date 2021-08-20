import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { firestore as db } from "@helpers/firebase/admin";
import slugify from "slugify";
import { authorizedMiddleware } from "@helpers/middleware";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
	// get info about post
	const { post } = req.query;

	await db
		.collection("posts")
		.where("slug", "==", post)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) return res.status(404).json({ error: "post not found" });

			res.status(200).json({ ...snapshot.docs[0].data() });
		})
		.catch((error) => {
			res.status(400).json({ error: `something went wrong: ${error}` });
			return null;
		});
});

handler.put(authorizedMiddleware, async (req, res) => {
	// update a post
	const { post } = req.query;

	db.runTransaction((transaction) => {
		const postRef = db.collection("posts").where("slug", "==", post);
		return transaction
			.get(postRef)
			.then((snapshot) => {
				if (snapshot.empty) return res.status(404).json({ error: "post not found" });
				else {
					const docToUpdate = { slug: snapshot.docs[0].data().slug, id: snapshot.docs[0].id };
					const updateRef = db.collection("posts").doc(docToUpdate.id);

					const timestamp = Date.now(); // timestamp
					const newDoc = {
						...req.body,
						slug: req.body.title ? slugify(req.body.title, { lower: true }) : docToUpdate.slug,
						updated: timestamp,
					};

					transaction.update(updateRef, newDoc);
					res.status(200).json(newDoc);
				}
			})
			.then(() => {
				console.log("update post: transaction finished successfully");
			})
			.catch((error) => {
				console.error("update post: error in transaction: ", error);
				res.status(400).json({ error: `something went wrong: ${error}` });
			});
	});
});

handler.delete(authorizedMiddleware, async (req, res) => {
	// delete a post
	const { post } = req.query;

	db.runTransaction((transaction) => {
		const postRef = db.collection("posts").where("slug", "==", post);
		return transaction
			.get(postRef)
			.then((snapshot) => {
				if (snapshot.empty) return res.status(404).json({ error: "post not found" });
				else {
					const deleteDoc = snapshot.docs[0];

					db.collection("posts")
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
				console.log("delete post: transaction finished successfully");
			})
			.catch((error) => {
				console.error("delete post: error in transaction: ", error);
				res.status(400).json({ error: `something went wrong: ${error}` });
			});
	});
});

export default handler;

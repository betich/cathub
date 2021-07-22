import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import initDB from "@helpers/db";
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
	const posts = await db.collection('posts').get();
	const postsData = posts.docs.map(post => post.data());
	
	if (postsData.some(post => post.slug === slug)) {
		res.status(409).json({ error: "a post with that name already exists" });
	} else {
		const requestData = { ...req.body, slug, created: new Date().toISOString() }
		
		await db.collection('posts')
		.add({ ...requestData })
		.then((docRef) => {
			console.log("added document: ", docRef.id);
			res.status(200).json({ ...requestData });
		})
		.catch((error) => {
			console.error("error adding document: ", error);
			res.status(400).json({ error: `something went wrong: ${error}` });
		});
	}
});

export default handler;
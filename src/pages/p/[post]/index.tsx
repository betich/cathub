import { FunctionComponent, useState, useEffect } from "react";
import { Heading } from "@components/General";
import { ThreedotLoading as Loading } from "@components/Loading";
import { LinkBack } from "@components/General";
import { PostData } from "@helpers/types";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import initDB from "@helpers/db";

const ViewPost: FunctionComponent<PostData> = ({ title, content, tags }) => {
	const router = useRouter();

	if (router.isFallback) return <Loading />
	else return (
		<>
			<Heading>{title}</Heading>
			<LinkBack href="/p">back to pages</LinkBack>
			<div>{JSON.stringify({ title, content, tags})}</div>
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const db = initDB();
	const data = await db.collection('posts')
		.get()
		.then((snapshot) => {
			const postsData = snapshot.docs.map(post => { return { params: { post: post.data().slug } } });
			return postsData;
		})
		.catch((error) => {
			console.error(error);
			return [];
		});

	return { paths: data, fallback: true }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const db = initDB();
	const data = await db.collection('posts').where("slug", "==", params?.post?.toString() ?? "")
		.get()
		.then((snapshot) => {
			if (snapshot.empty) throw new Error();
			else return { ...snapshot.docs[0].data() };
		})
		.catch((error) => {
			return { error: `something went wrong: ${error}` };
		});

	if (!data.hasOwnProperty("error")) {
		return {
			props: { ...data },
			revalidate: 5
		}
	}
	
	return {
		notFound: true,
		revalidate: 1
	}
};

export default ViewPost;

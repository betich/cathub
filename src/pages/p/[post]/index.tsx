import { FunctionComponent, useState, useEffect } from "react";
import { Heading } from "@components/General";
import { ThreedotLoading as Loading } from "@components/Loading";
import { LinkBack } from "@components/General";
import { PostData } from "@helpers/types";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import initDB from "@helpers/db";
import Link from "next/link";

const ViewPost: FunctionComponent<PostData> = ({ title, content, tags, slug }) => {
	const router = useRouter();

	if (router.isFallback) return <Loading />
	else return (
		<>
			<Heading>{title}</Heading>
			<LinkBack href="/p">back to pages</LinkBack>
			<div className="flex justify-center">
				<Link href={`/p/${slug}/edit`}>
					<a className="text-purple-700 hover:text-purple-900 text-center mr-5">edit</a>
				</Link>
				<Link href={`/p/${slug}/delete`}>
					<a className="text-purple-700 hover:text-purple-900 text-center">delete</a>
				</Link>
			</div>
			<div>
				<p>{content}</p>
				<p>{tags.join(", ")}</p>
			</div>
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
			revalidate: 1 * 60
		}
	}
	
	return {
		notFound: true,
		revalidate: 1
	}
};

export default ViewPost;

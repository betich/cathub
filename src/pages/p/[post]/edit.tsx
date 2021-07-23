import { FunctionComponent, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { Heading, LinkBack } from "@components/General";
import { PostForm, PostTitle, PostContent, PostTags, PostSubmit } from "@components/Form";
import { ThreedotLoading as Loading } from "@components/Loading";
import { GetStaticPaths, GetStaticProps } from "next";
import initDB from "@helpers/db";
import { PostData } from "@helpers/types";

const Edit: FunctionComponent<PostData> = ({ title, content, tags, slug }) => {
	const router = useRouter();
	const { post } = router.query;

	const [formTitle, setTitle] = useState(title);
	const [formContent, setContent] = useState(content);
	const [formTags, setTags] = useState<string[]>(tags);
	const [loading, setLoad] = useState(false);

	const handleTitle = (e: FormEvent) => {
		const elem = e.currentTarget as HTMLInputElement;
		setTitle(elem.value);
	}

	const handleContent = (e: FormEvent) => {
		const elem = e.currentTarget as HTMLInputElement;
		setContent(elem.value);
	}

	const handleTagChange = (newTags: string[]) => {
		setTags(newTags);
	}

	const handleSubmit = (e: FormEvent) => {
		setLoad(true);
		e.preventDefault();
		const reqData = {
			title: formTitle,
			content: formContent,
			tags: formTags
		};

		fetch(`/api/posts/${post}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(reqData)
		})
		.then(response => {
			switch (response.status) {
				case 200:
					return response.json();
				case 400:
					throw Error("unknown error");
				case 404:
					throw Error("unknown resource");
				case 409:
					throw Error("name conflict");
				default:
					throw Error("unknown response");
			}
		})
		.then(data => {
			router.push(`/p/${data.slug}`);
		})
		.catch((error) => {
			console.error('error:', error);
			setLoad(false);
		});
	}

	const FormElement = () => {
		if (loading) return <Loading />;
		else return (
			<PostForm onsubmit={handleSubmit}>
				<PostTitle value={formTitle} required onchange={handleTitle} placeholder="Post Title" />
				<PostContent value={formContent} required onchange={handleContent} placeholder="Write something..." />
				<PostTags tagchange={handleTagChange} tags={formTags} />
				<PostSubmit />
			</PostForm>
		);
	}

	if (router.isFallback) return <Loading />;
	return (
		<>
			<Heading>Edit {title}</Heading>
			<LinkBack href={`/p/${slug}`}>back to page</LinkBack>
			{FormElement()}
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

export default Edit;

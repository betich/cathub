import { FunctionComponent, useState, useEffect, FormEvent, useReducer } from "react";
import { useRouter } from "next/router";
import { Heading, LinkBack } from "@components/elements/General";
import { PostForm, PostTitle, PostContent, PostTags, PostSubmit } from "@components/elements/Form";
import { ThreedotLoading as Loading } from "@components/elements/Loading";
import { GetStaticPaths, GetStaticProps } from "next";
import { initDB } from "@helpers/firebase";
import { PostData } from "@types";
import { postReducer } from "@modules/post";

const Edit: FunctionComponent<PostData> = ({ title, content, tags, slug }) => {
	const router = useRouter();
	const { post } = router.query;

	const [state, dispatch] = useReducer(postReducer, {
		title: title,
		content: content,
		tags: tags,
	});
	const [loading, setLoad] = useState(false);

	const handleTitle = (e: FormEvent) => {
		const elem = e.currentTarget as HTMLInputElement;
		dispatch({ type: "title", title: elem.value });
	};

	const handleContent = (e: FormEvent) => {
		const elem = e.currentTarget as HTMLInputElement;
		dispatch({ type: "content", content: elem.value });
	};

	const handleTagChange = (newTags: string[]) => {
		dispatch({ type: "tags", tags: newTags });
	};

	const handleSubmit = (e: FormEvent) => {
		setLoad(true);
		e.preventDefault();
		const reqData = {
			title: state.title,
			content: state.content,
			tags: state.tags,
		};

		fetch(`/api/posts/${post}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqData),
		})
			.then((response) => {
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
			.then((data) => {
				router.push(`/p/${data.slug}`);
			})
			.catch((error) => {
				console.error("error:", error);
				setLoad(false);
			});
	};

	const FormElement = () => {
		if (loading) return <Loading />;
		else
			return (
				<PostForm onsubmit={handleSubmit}>
					<PostTitle value={state.title} required onchange={handleTitle} placeholder="Post Title" />
					<PostContent
						value={state.content}
						required
						onchange={handleContent}
						placeholder="Write something..."
					/>
					<PostTags tagchange={handleTagChange} tags={state.tags} />
					<PostSubmit />
				</PostForm>
			);
	};

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
	const data = await db
		.collection("posts")
		.get()
		.then((snapshot) => {
			const postsData = snapshot.docs.map((post) => {
				return { params: { post: post.data().slug } };
			});
			return postsData;
		})
		.catch((error) => {
			console.error(error);
			return [];
		});

	return { paths: data, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const db = initDB();
	const data = await db
		.collection("posts")
		.where("slug", "==", params?.post?.toString() ?? "")
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
			revalidate: 1 * 60,
		};
	}

	return {
		notFound: true,
		revalidate: 1,
	};
};

export default Edit;

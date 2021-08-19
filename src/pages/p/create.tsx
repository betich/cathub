import { FunctionComponent, useState, FormEvent, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { Heading, LinkBack } from "@components/elements/General";
import { PostForm, PostTitle, PostContent, PostTags, PostSubmit } from "@components/elements/Form";
import { ThreedotLoading as Loading } from "@components/elements/Loading";
import { useAuth } from "@modules/auth";
import { postReducer } from "@modules/post";

const TAGS = ["food", "inspiration", "entertainment", "nature"];

const Create: FunctionComponent = () => {
	const router = useRouter();
	const { user, loading: authLoading, getToken } = useAuth();

	useEffect(() => {
		if (authLoading) return;

		if (!user && !authLoading) {
			router.push("/login");
		}
	}, [user, authLoading]);

	const [state, dispatch] = useReducer(postReducer, {
		title: "",
		content: "",
		tags: [...TAGS],
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

	const handleSubmit = async (e: FormEvent) => {
		setLoad(true);
		e.preventDefault();
		const reqData = { ...state };

		const token = getToken ? await getToken() : null;
		if (!token) return; // error

		await fetch("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
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
			})
			.finally(() => {
				setLoad(false);
			});
	};

	const FormElement = () => {
		if (loading || authLoading) return <Loading />;
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

	return (
		<>
			<Heading>Create a Post</Heading>
			<LinkBack href="/">back to main</LinkBack>
			{FormElement()}
		</>
	);
};

export default Create;

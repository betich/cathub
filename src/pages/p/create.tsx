import { FunctionComponent, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Heading, LinkBack } from "@components/elements/General";
import { PostForm, PostTitle, PostContent, PostTags, PostSubmit } from "@components/elements/Form";
import { ThreedotLoading as Loading } from "@components/elements/Loading";

const TAGS = ["food", "inspiration", "entertainment", "nature"];

const Create: FunctionComponent = () => {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([...TAGS]);
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
		const reqData = {title, content, tags};

		fetch('/api/posts', {
			method: 'POST',
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
		})
		.finally(() => {
			setLoad(false);
		});
	}

	const FormElement = () => {
		if (loading) return <Loading />;
		else return (
			<PostForm onsubmit={handleSubmit}>
				<PostTitle value={title} required onchange={handleTitle} placeholder="Post Title" />
				<PostContent value={content} required onchange={handleContent} placeholder="Write something..." />
				<PostTags tagchange={handleTagChange} tags={tags} />
				<PostSubmit />
			</PostForm>
		);
	}

	return (
		<>
			<Heading>Create a Post</Heading>
			<LinkBack href="/">back to main</LinkBack>
			{FormElement()}
		</>
	);
};

export default Create;

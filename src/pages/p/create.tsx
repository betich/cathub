import { FunctionComponent, useState, useEffect, FormEvent } from "react";
import { Heading, LinkBack } from "@components/General";
import { PostForm, PostTitle, PostContent, PostTags, PostSubmit } from "@components/Form";

const TAGS = ["food", "inspiration", "entertainment", "nature"];

const Create: FunctionComponent = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([...TAGS]);

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
		e.preventDefault();
		const reqData = {title, content, tags};

		fetch('https://example.com/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(reqData)
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<>
			<Heading>Create a Post</Heading>
			<LinkBack href="/">back to main</LinkBack>
			<PostForm onsubmit={handleSubmit}>
				<PostTitle value={title} required onchange={handleTitle} placeholder="Post Title" />
				<PostContent value={content} required onchange={handleContent} placeholder="Write something..." />
				<PostTags tagchange={handleTagChange} tags={tags} />
				<PostSubmit />
			</PostForm>
		</>
	);
};

export default Create;

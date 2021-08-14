import { FunctionComponent, MouseEvent, FormEvent, useState, useEffect, useRef, KeyboardEvent } from "react";
import { TagButtonElement, InputElement, TagsElement, FormPost } from "./types";

export const PostForm: FunctionComponent<FormPost> = ({ children, onsubmit }) => {
	return (
		<div className="mx-auto w-full md:w-3/4 lg:w-5/7">
			<form method="post" className="shadow-md border border-gray-200 px-8 pt-6 pb-8 mb-4" onSubmit={onsubmit}>
				{children}
			</form>
		</div>
	);
};

export const PostTitle: FunctionComponent<InputElement> = ({ onchange, value, placeholder, required }) => {
	const inputElement = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputElement.current) {
		  inputElement.current.focus(); // autofocus
		}
	}, []);

	const handleChange = (e: FormEvent<HTMLElement>) => {
		if (onchange) {
			onchange(e);
		}
	}

	return (
		<div className="mb-10 border-b-2 border-purple-500">
			<input type="text" tabIndex={2} onChange={handleChange} ref={inputElement} required={required} value={value} className="resize-none appearance-none bg-transparent border-none rounded w-full py-2 mt-3 text-gray-700 text-2xl leading-tight focus:outline-none focus:shadow-outline" id="title" placeholder={placeholder ?? ""}></input>
		</div>
	);
};

export const PostContent: FunctionComponent<InputElement> = ({ onchange, value, placeholder, required }) => {
	const handleChange = (e: FormEvent<HTMLElement>) => {
		if (onchange) {
			onchange(e);
		}
	}

	return (
		<div className="mb-10">
			<textarea onChange={handleChange} tabIndex={2} required={required} value={value} className="resize-none shadow appearance-none border rounded w-full py-2 px-3 mt-3 text-gray-700 h-48 overflow-x-hidden overflow-y-scroll leading-tight focus:outline-none focus:shadow-outline" id="content" placeholder={placeholder ?? ""} />
		</div>
	);
};

export const TagButton: FunctionComponent<TagButtonElement> = ({ children, onremove, id, index }) => {
	const handleClick = (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		if (onremove) onremove(index);
	}

	return (
		<button type="button" id={id} className="tag-button" onClick={handleClick}>
			{children}&nbsp;<span className="text-red-400">x</span>
		</button>
	);
};

export const PostTags: FunctionComponent<TagsElement> = ({ tagchange, tags }) => {
	const [value, setValue] = useState("");
	const [_tags, setTags] = useState(tags);

	useEffect(() => {
		tagchange(_tags);
	}, [_tags])
	
	const handleChange = (e: FormEvent) => {
		const elem = e.currentTarget as HTMLInputElement;
		setValue(elem.value);
	}

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === "Enter" && value !== "") {
			e.preventDefault();
			handleAddTag(value);
			setValue("");
		}
	}

	const handleAddTag = (value: string) => {
		setTags([...tags, value]);
	}

	const handleRemove = (index: number) => {
		setTags([...tags.filter(tag => tags.indexOf(tag) !== index)]);
	}

	let TagButtons;
	if (tags) {
		TagButtons = _tags.map((tag, i) => <TagButton key={tag} id={tag} index={i} onremove={handleRemove}>{tag}</TagButton>);
	}

	return (
		<div className="mb-10">
			<fieldset className="my-5 flex justify-start items-center">
				<label className="label-text" htmlFor="tags">Tags:</label>
				<div className="border-b-2 border-gray-200 flex-grow">
					<input
						type="text"
						tabIndex={2}
						className="py-2 px-2 w-full resize-none appearance-none bg-transparent border-none rounded leading-tight focus:outline-none focus:shadow-outline"
						onKeyPress={handleKeyPress} onChange={handleChange} value={value} placeholder="Press Enter to add tags..."
					/>
				</div>
			</fieldset>
			<fieldset className="flex flex-wrap w-full justify-start" id="tags">
			{TagButtons ?? ""}
			</fieldset>
		</div>
	);
};

export const PostSubmit: FunctionComponent = () => {
	return (
		<div className="mb-10">
			<input type="submit" className="button-block w-full" />
		</div>
	);
};
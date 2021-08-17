import { PostForm } from "@types";

type actions = "title" | "content" | "tags";

type ActionType = {
	type: actions;
	title?: string;
	content?: string;
	tags?: string[];
};

export const postReducer = (state: PostForm, action: ActionType) => {
	switch (action.type) {
		case "title":
			return { ...state, title: action.title ?? "" };
		case "content":
			return { ...state, content: action.content ?? "" };
		case "tags":
			return { ...state, tags: action.tags ?? [] };
		default:
			throw new Error("Error while setting a form value.");
	}
};

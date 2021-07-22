import { ReactNode, FormEvent } from "react";

export type InputElement = {
	onchange: (e: FormEvent<HTMLElement>) => void,
	value: string,
	placeholder?: string,
	required?: boolean
}

export type TagButtonElement = {
	children: ReactNode,
	onremove: (i: number) => void,
	id?: string,
	index: number
}

export type TagsElement = {
	tagchange: (t: string[]) => void,
	tags: string[]
}

export type FormPost = {
	children: ReactNode,
	onsubmit: (e: FormEvent) => void
}
export type UserData = {
	uid: string,
	email: string | null,
	name: string | null
}

export type UserContext = {
	user: UserData | null,
	loading: boolean,
	signinWithGoogle?: (redirect: string) => Promise<void>,
	signinWithEmail?: (email: string, password: string) => Promise<void>,
	createUserWithEmail?: (email: string, password: string) => Promise<void>,
	signout?: () => void
}
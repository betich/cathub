import { useState, useEffect } from "react";

import { client as firebase } from "@helpers/firebase";
import { UserData } from "@types";
import { getCurrentUserData, createUser } from "@modules/auth/client";
import Router from "next/router";

const formatUser = (user: firebase.User): UserData => {
	return {
		uid: user.uid,
		email: user.email,
		name: user.displayName,
	};
};

export default function useFirebaseAuth() {
	const [rawUser, setRawUser] = useState<null | firebase.User>(null);
	const [user, setUser] = useState<null | UserData>(null);
	const [loading, setLoading] = useState(true);

	const handleUser = async (newRawUser: firebase.User | null) => {
		if (newRawUser) {
			const formattedUser = formatUser(newRawUser);
			await createUser(formattedUser.uid, formattedUser);
			setRawUser(newRawUser);

			// cookie.set(AUTH_COOKIE, true,
			// 	expires:
			// })

			setLoading(false);
		} else {
			setRawUser(null);
			// cookie.remove(AUTH_COOKIE)

			setLoading(false);
		}
	};

	useEffect(() => {
		// const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
		const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

		return () => unsubscribe(); // cleanup
	}, []);

	useEffect(() => {
		if (rawUser) {
			updateUserData();
		}
	}, [rawUser]);

	const updateUserData = async () => {
		if (!rawUser) return;
		setLoading(true);
		const data = await getCurrentUserData(rawUser.uid);
		if (data) {
			setUser(data as UserData);
			setLoading(false);
		} else {
			setUser(null);
			setLoading(false);
		}
	};

	const signinWithEmail = async (email: string, password: string) => {
		setLoading(true);

		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((response) => {
				handleUser(response.user);
			});
	};

	const createUserWithEmail = async (email: string, password: string) => {
		setLoading(true);

		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((response) => {
				handleUser(response.user);
			});
	};

	const signinWithGoogle = async (redirect: string) => {
		setLoading(true);

		await firebase
			.auth()
			.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then((response) => {
				handleUser(response.user);

				if (redirect) {
					Router.push(redirect);
				}
			});
	};

	const signout = async (redirect?: string) => {
		setLoading(true);

		await firebase
			.auth()
			.signOut()
			.then(() => {
				handleUser(null);
				Router.push(redirect ?? "/");
			});
	};

	const getToken = async () => {
		const token = await firebase.auth()?.currentUser?.getIdToken(/* forceRefresh */ true);
		return token;
	};

	return {
		user,
		loading,
		signinWithGoogle,
		signinWithEmail,
		createUserWithEmail,
		signout,
		getToken,
	};
}

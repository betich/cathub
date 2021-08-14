import { useState, useEffect } from "react";

import firebase from "@helpers/firebase/client";
import { UserData } from "@types";
import { getCurrentUserData, createUser } from "@modules/auth";
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
			const user = formatUser(newRawUser);
			await createUser(user.uid, user);
			setRawUser(newRawUser);
		  
			// cookie.set(AUTH_COOKIE, true,
			// 	expires:
			// })
	
			setLoading(false);
		} else {
			console.log("Hi")
			setRawUser(null);
			// cookie.remove(AUTH_COOKIE)
	
			setLoading(false);
		}
	}

	/*
	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((newRawUser: firebase.User | null) => {
			if (newRawUser) {
				// User is signed in.
				const newUser = formatUser(newRawUser);
				createUser(newUser.uid, newUser);
				setRawUser(rawUser);

				// cookie.set(AUTH_COOKIE, true, {
				// 	expires: 1
				// })

				setLoading(false);
			} else {
				setRawUser(null);
				// cookie.remove(AUTH_COOKIE)

				setLoading(false);
			}
		});

		return () => unsubscribe(); // cleanup
	}, [])
	*/

	useEffect(() => {
		if (rawUser) {
			updateUserData();
		}
	}, [rawUser]);

	const updateUserData = async () => {
		if (!rawUser) return;
		const data = await getCurrentUserData(rawUser.uid);
		if (data) {
			setUser(data as UserData);
		} else {
			setUser(null);
		}
	};

	const signinWithEmail = async (email: string, password: string) => {
		setLoading(true);

		const response = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);

		// handleUser(response.user);
	};

	const createUserWithEmail = async (email: string, password: string) => {
		setLoading(true);

		const response = await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password);

		// handleUser(response.user);
	};

	const signinWithGoogle = async (redirect: string) => {
		setLoading(true);

		
		const response = await firebase
			.auth()
			.signInWithPopup(new firebase.auth.GoogleAuthProvider());
		
		await handleUser(response.user);

		// if (redirect) {
		// 	Router.push(redirect);
		// }
	};

	const signout = async () => {
		Router.push("/");

		await firebase.auth().signOut();
		// return await handleUser(null)
	};

	return {
		user,
		loading,
		signinWithGoogle,
		signinWithEmail,
		createUserWithEmail,
		signout,
	};
}

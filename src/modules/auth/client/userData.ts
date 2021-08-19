import { client as firebase } from "@helpers/firebase";

const db = firebase.firestore();

export const getCurrentUserData = async (uid: string): Promise<null | firebase.firestore.DocumentData> => {
	const ref = db.collection("users").doc(uid);

	const doc = await ref.get();
	if (doc.exists) {
		return doc.data() ?? null;
	} else {
		return null;
	}
};

export const updateUser = (uid: string, data: firebase.firestore.DocumentData): Promise<void> => {
	return db.collection("users").doc(uid).update(data);
};

export const createUser = (uid: string, data: firebase.firestore.DocumentData): Promise<void> => {
	return db
		.collection("users")
		.doc(uid)
		.set({ uid, ...data }, { merge: true });
};

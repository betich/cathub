import admin, { GoogleOAuthAccessToken } from "firebase-admin";
import cert from "./certificate";

export const initDB = () => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(cert),
		});
	}

	return admin.firestore();
};

export const verifyAuth = (token: string) => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(cert),
		});
	}

	return admin.auth().verifyIdToken(token).catch((err) => {
		console.error(err);
	});
};
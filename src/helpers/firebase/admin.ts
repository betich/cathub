import admin from "firebase-admin";
import cert from "./certificate";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(cert),
	});
}

export const firestore = admin.firestore();
export const auth = admin.auth();

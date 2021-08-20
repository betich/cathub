import { auth } from "@helpers/firebase/admin";

export const checkAuthenticated = async (token: string): Promise<[boolean, string | null]> => {
	// checks if user is authenticated
	const loggedIn = await auth.verifyIdToken(token).catch((err) => {
		console.error(err);
	});

	if (loggedIn?.uid) {
		// has uid
		return [true, loggedIn.uid];
	} else {
		// isn't authenticated
		return [false, null];
	}
};

export const checkAuthorzied = async (
	token: string,
	targetUID: string | null
): Promise<[boolean, number, string] | [boolean, string]> => {
	// checks if the current user is authorized

	// check authentication
	if (!targetUID) return [false, 401, "user body not found in the request"];

	const [loggedIn, data] = await checkAuthenticated(token);
	if (!loggedIn) return [false, 401, "user is not logged in"];

	// check authorization
	const userUID = data as string;
	if (targetUID !== userUID) return [false, 403, "user is not authorized"];
	else return [true, userUID];
};

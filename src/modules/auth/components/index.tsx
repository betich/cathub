import { createContext, FunctionComponent, useContext } from "react";
import { useFirebaseAuth } from "@modules/auth";
import { UserData } from "@types";

type UserContext = {
	user: UserData | null;
	loading: boolean;
	signinWithGoogle?: (redirect: string) => Promise<void>;
	signinWithEmail?: (email: string, password: string) => Promise<void>;
	createUserWithEmail?: (email: string, password: string) => Promise<void>;
	getToken?: () => Promise<string | undefined>;
	signout?: (redirect?: string) => void;
};

const AuthContext = createContext<UserContext>({
	user: null,
	loading: true,
});

export const AuthProvider: FunctionComponent = ({ children }) => {
	const auth = useFirebaseAuth();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

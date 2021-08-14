import { createContext, FunctionComponent, useContext } from 'react';
import { UserContext } from '@types';
import { useFirebaseAuth } from '@modules/auth';

const AuthContext = createContext<UserContext>({
	user: null,
	loading: true
});

export const AuthProvider: FunctionComponent = ({ children }) => {
	const auth = useFirebaseAuth();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);
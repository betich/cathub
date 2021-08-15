import { SignInWithGoogle, useAuth } from "@modules/auth";
import { FunctionComponent, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Login: FunctionComponent = () => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log('login update', user, loading)
		if (user && !loading) {
			console.log('to index', user)
			router.push('/');
		}
	}, [user, loading]);

	return (
		<>
			<Head>
				<title>Login to Cathub</title>
			</Head>
			<h1>Sign in</h1>
			<SignInWithGoogle />
		</>
	);
}

export default Login;
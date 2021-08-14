import { SignInWithGoogle } from "@modules/auth";
import { FunctionComponent } from "react";
import Head from "next/head";

const Login: FunctionComponent = () => {
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
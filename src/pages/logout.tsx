import { useAuth } from "@modules/auth";
import { FunctionComponent, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Logout: FunctionComponent = () => {
	const { user, loading, signout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user && !loading) {
			if (signout) signout('/');
		} else {
			router.push('/');
		}
	}, [user]);

	return (
		<>
			<Head>
				<title>Logout</title>
			</Head>
		</>
	);
}

export default Logout;
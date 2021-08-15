import { useAuth } from "@modules/auth";
import { FunctionComponent, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Logout: FunctionComponent = () => {
	const { user, loading, signout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (loading) return;

		if (user && !loading) {
			// logged in and not loading
			if (signout) signout('/');
		} else {
			// not logged in
			router.push('/');
		}
	}, [user, loading]);

	return (
		<>
			<Head>
				<title>Logout</title>
			</Head>
		</>
	);
}

export default Logout;
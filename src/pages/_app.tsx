// import 'tailwindcss/tailwind.css'
import "@styles/styles.scss";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { HeartLoading as Loading } from "@components/elements/Loading";
import { useRouter } from "next/router";
import { AuthProvider } from "@modules/auth";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const start = () => {
			setLoading(true);
		};
		const end = () => {
			setLoading(false);
		};

		router.events.on("routeChangeStart", start);
		router.events.on("routeChangeComplete", end);
		router.events.on("routeChangeError", end);

		return () => {
			router.events.off("routeChangeStart", start);
			router.events.off("routeChangeComplete", end);
			router.events.off("routeChangeError", end);
		};
	}, []);

	return loading ?
		<Loading />
	:
		<AuthProvider>
			<Component {...pageProps} />;
		</AuthProvider>
}

export default MyApp;

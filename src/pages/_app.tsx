// import 'tailwindcss/tailwind.css'
import "@styles/styles.scss";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { HeartLoading as Loading } from "@components/Loading";

function MyApp({ Component, pageProps }: AppProps) {
	const [loading, setLoad] = useState(true);

  useEffect(() => {setLoad(false)}, []);

  if (loading) return <Loading />;
  else return <Component {...pageProps} />;
}

export default MyApp;

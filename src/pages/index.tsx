import { FunctionComponent, useEffect } from "react";
import { LinkButton, LinkList } from "@components/layout/Landing";
import { Heading } from "@components/elements/General";
import { useAuth } from "@modules/auth";
import { useRouter } from "next/router";
import { HeartLoading } from "@components/elements/Loading";
import Head from "next/head";

const Home: FunctionComponent = () => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/login');
		}
	}, [user])

	if (loading) return <HeartLoading />;

	else return (
		<>
			<Head>
				<title>Cathub</title>
			</Head>
			<Heading>CatHub</Heading>
			<LinkList>
				<LinkButton href="/p/create">Create a Post</LinkButton>
				<LinkButton href="/p">View Posts</LinkButton>
				<LinkButton href="/">Cat Battles!</LinkButton>
			</LinkList>
		</>
	);
};

export default Home;

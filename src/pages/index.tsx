import Head from "next/head";
import { FunctionComponent } from "react";
import { LinkButton, LinkList } from "@components/Landing";
import { Heading } from "@components/General";

const Home: FunctionComponent = () => {
	return (
		<>
			<Head>
				<title>CatHub</title>
				<link rel="icon" href="/favicon.ico" />
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

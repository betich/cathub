import { FunctionComponent, useEffect, useState } from "react";
import { LinkButton, LinkList } from "@components/layout/Landing";
import { Heading } from "@components/elements/General";
import { useAuth } from "@modules/auth";
import { HeartLoading } from "@components/elements/Loading";
import Head from "next/head";

const Home: FunctionComponent = () => {
	const { user, loading } = useAuth();

	if (loading) return <HeartLoading />;

	else return (
		<>
			<Head>
				<title>Cathub</title>
			</Head>
			<Heading>CatHub</Heading>
			{user?.name /* logged in */ && <p className="text-xl text-center text-purple-700 mt-5">Hi, {user.name}!</p>}
			<LinkList>
				{user?.name /* logged in */  ? <LinkButton href="/logout">Logout</LinkButton> : <LinkButton href="/login">Login</LinkButton>}
				<LinkButton href="/p/create">Create a Post</LinkButton>
				<LinkButton href="/p">View Posts</LinkButton>
				<LinkButton href="/">Cat Battles!</LinkButton>
			</LinkList>
		</>
	);
};

export default Home;

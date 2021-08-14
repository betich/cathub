import { FunctionComponent, useState, useEffect } from "react";
import { Heading } from "@components/elements/General";
import { ThreedotLoading as Loading } from "@components/elements/Loading";
import { LinkBack } from "@components/elements/General";
import { LinkButton, LinkList } from "@components/layout/Landing";
import { PostData } from "@types";

const Posts: FunctionComponent = () => {
	const [loading, setLoad] = useState(true);
	const [data, setData] = useState<PostData[]>([])

	useEffect(() => {
		fetch('/api/posts', {
			method: 'GET'
		})
		.then(response => {
			switch (response.status) {
				case 200:
					return response.json();
				case 400:
					throw Error("unknown error");
				default:
					throw Error("unknown response");
			}
		})
		.then(data => {
			setData(data);
		})
		.catch((error) => {
			console.error('error:', error);
		})
		.finally(() => {
			setLoad(false);
		});
	}, [])

	const dataElem = data.map((e, i) => <LinkButton href={`p/${e.slug}`} key={i}>{e.title}</LinkButton>);

	if (loading) return <Loading />
	else return (
		<>
			<Heading>Pages</Heading>
			<LinkBack href="/">back to main</LinkBack>
			<LinkList>
				{dataElem}
			</LinkList>
		</>
	);
};

export default Posts;

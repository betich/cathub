import { ThreedotLoading as Loading } from "@components/elements/Loading";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";

const Delete: FunctionComponent = () => {
	const [error, setError] = useState<Error>(new Error());
	const [loading, setLoad] = useState(true);
	
	const router = useRouter();
	const { post } = router.query;

	useEffect(() => {
		fetch(`/api/posts/${post}`, {
			method: 'DELETE'
		})
		.then(response => {
			switch (response.status) {
				case 200:
					return router.push('/p');
				case 400:
					throw Error("unknown error");
				case 404:
					throw Error("can't find the document");
				default:
					throw Error("unknown response");
			}
		})
		.catch((error) => {
			console.error('error:', error);
			setError(error);
		})
		.finally(() => {
			setLoad(false);
		});
	}, [])

	if (loading) return <Loading />;
	else if (error.message) return <span className="absolute top-1/2 left-1/2 text-lg -translate-x-1/2 -translate-y-3/4 text-purple-700">{error.message}</span>;
	else return <span>ok</span>;
}

export default Delete;
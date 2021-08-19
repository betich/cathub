import { ThreedotLoading as Loading } from "@components/elements/Loading";
import { useAuth } from "@modules/auth";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";

const Delete: FunctionComponent = () => {
	const [error, setError] = useState<Error>(new Error());
	const [loading, setLoad] = useState(true);

	const { user, loading: authLoading, getToken } = useAuth();

	useEffect(() => {
		if (authLoading) return;

		if (!user && !authLoading) {
			router.push("/login");
		}
	}, [user, authLoading]);

	const router = useRouter();
	const { post } = router.query;

	const handleDelete = async () => {
		const token = getToken ? await getToken() : null;
		if (!token) return router.push("/login"); // error

		await fetch(`/api/posts/${post}`, {
			method: "DELETE",
			headers: {
				token: token,
			},
		})
			.then((response) => {
				switch (response.status) {
					case 200:
						return router.push("/p");
					case 400:
						throw Error("unknown error");
					case 404:
						throw Error("can't find the document");
					default:
						throw Error("unknown response");
				}
			})
			.catch((error) => {
				console.error("error:", error);
				setError(error);
			})
			.finally(() => {
				setLoad(false);
			});
	};

	useEffect(() => {
		handleDelete();
	}, []);

	if (loading) return <Loading />;
	else if (error.message)
		return (
			<span className="absolute top-1/2 left-1/2 text-lg -translate-x-1/2 -translate-y-3/4 text-purple-700">
				{error.message}
			</span>
		);
	else return <span>ok</span>;
};

export default Delete;

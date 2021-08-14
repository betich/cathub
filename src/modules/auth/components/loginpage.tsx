import { FunctionComponent, MouseEvent } from "react";
import { useAuth } from "@modules/auth";

export const SignInWithGoogle: FunctionComponent = () => {
	const { signinWithGoogle } = useAuth();

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (signinWithGoogle) signinWithGoogle('/');
    };

    return (
        <>
            <button onClick={handleClick}>Sign in with Google</button>
        </>
    );
}
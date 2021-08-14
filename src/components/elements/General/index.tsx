import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";

export const Heading: FunctionComponent = ({ children }) => {
    return (
        <h1 className="heading-text text-center mt-10 mb-3">
            {children}
        </h1>
    );
};

type Button = {
	children: ReactNode,
	onclick?: () => void
}

export const Button: FunctionComponent<Button> = ({ children, onclick }) => {
	return (
		<button className="button-block" onClick={onclick}>
			{children}
		</button>
	);
}

type LinkBack = {
    children: ReactNode,
    href: string
}

export const LinkBack: FunctionComponent<LinkBack> = ({ children, href }) => {
    return (
		<div className="text-center mt-3 mb-9">
			<Link href={href}>
				<a className="text-purple-700 hover:text-purple-900">
					{children}
				</a>
			</Link>
		</div>
    );
};
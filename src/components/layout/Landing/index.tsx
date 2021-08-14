import { FunctionComponent, ReactNode } from "react";
import Link from 'next/link';

export const LinkList: FunctionComponent = ({ children }) => {
    return (
        <div className="flex flex-col my-24 h-1/2 items-center w-full">
            <ul className="list-none">
                {children}
            </ul>
        </div>
    );
}

type LinkButton = {
    children: ReactNode,
    href: string
}

export const LinkButton: FunctionComponent<LinkButton> = ({ children, href }) => {
    return (
        <Link href={href}>
            <li className="link-button">
				<a className="link">{children}</a>
            </li>
		</Link>
    );
}
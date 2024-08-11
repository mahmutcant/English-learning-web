"use client"
import { SessionProvider as Provider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
}

export const SessionProvider:React.FC<Props> = ({children}: Props) => {
    return(
        <Provider>
            {children}
        </Provider>
    )
}
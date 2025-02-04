import React from 'react';
import { FunctionComponent, PropsWithChildren } from 'react';

import io, { Socket } from "socket.io-client";

export let socket:Socket ;


export interface SocketContextType {
    updateSocket: (new_socket: Socket) => void;
    socket: Socket
};

export const SocketContext = React.createContext<SocketContextType | undefined>(undefined);

export interface Props{
    children: React.ReactNode
}

const SocketProvider =  (props:Props) => {
    const [socket, setSocket] = React.useState<Socket>(io());

    const updateSocket = (new_socket:Socket) => {
        setSocket(new_socket);
    }
    return <SocketContext.Provider value={{ socket, updateSocket }}>{props.children}</SocketContext.Provider>;
}

export default SocketProvider;


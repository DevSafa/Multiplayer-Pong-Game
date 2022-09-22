import { Stack } from "@mui/material"
import ChatUIRoom from "./ChatUIRoom"
import Friends from "./Friends"
import { useSelector } from "react-redux"
import { RootState } from "../store";

import Rooms from "./Rooms"
import ChatUIFriend from "./ChatUIFriend"
import { UsersRoom } from "./UsersRoom"
import { UsersMessaging } from "./UsersMessaging"
import { InterfaceEnum } from "../store/interfacesReducer"
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocketClient, disconnectSocket } from "../store/socketReducer";
import { io, Socket } from "socket.io-client";
import { SocketContext, SocketContextType } from "../context/socket";
import { changeCurrRoom } from "../store/chatUiReducer";



const ChatGlobal = () => {
	const logged_user = useSelector((state: RootState) => state.user).login;
	const currentPage = useSelector((state: RootState) => state.interfaces).current;
	const currentRoom = useSelector((state: RootState) => state.chat).curr_room;
	const curr_conv = useSelector((state: RootState) => state.chat).curr_converation;
	let { socket, updateSocket } = useContext(SocketContext) as SocketContextType;

	function joinRoom(curr_user: string): Socket {
		if ((!socket || socket.disconnected) && currentRoom !== '') {
			socket = io(process.env.REACT_APP_SERVER_IP as string, {
				auth: {
					room: currentRoom,
					user: curr_user,
				}
			});
		}
		if (socket)
		socket.emit('JoinRoom');
		return (socket);
	}

	function joinDmRoom(curr_user: string): Socket {
		if ((!socket || socket.disconnected) && curr_conv !== '') {
			socket = io(process.env.REACT_APP_SERVER_IP as string, {
				auth: {
					from: curr_user,
					to: curr_conv,
				}
			});
		}
		if (socket)
		socket.emit('join_dm_room');
		return (socket);
	}

	useEffect(() => {
		console.log("Global :" + currentRoom);
		if ((currentPage === InterfaceEnum.InstantMessaging) || (currentPage === InterfaceEnum.Friends))
			updateSocket(joinDmRoom(logged_user));
		else
			updateSocket(joinRoom(logged_user));
		return () => {
			if (socket)
				socket.disconnect();
		}
	}, [currentRoom])

	return (
		<Stack direction="row" height="100vh" >
			{(currentPage === InterfaceEnum.InstantMessaging) || (currentPage === InterfaceEnum.Friends) ? <Friends /> : <Rooms />}
			{(currentPage === InterfaceEnum.InstantMessaging) || (currentPage === InterfaceEnum.Friends) ? <UsersMessaging /> : <UsersRoom />}
			{(currentPage === InterfaceEnum.InstantMessaging) || (currentPage === InterfaceEnum.Friends) ? <ChatUIFriend /> : <ChatUIRoom />}
		</Stack>
	)
}

export default ChatGlobal
import { Box, IconButton, List, Stack, Typography } from '@mui/material'
import roomIcon from '../assets/chat-room.png'
import RoomButtonChat from './RoomButtonChat';
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocketClient, disconnectSocket } from "../store/socketReducer";
import { RootState } from '../store';
import { getMyRooms, RoomsOfUser } from '../requests/rooms';
import { io, Socket } from 'socket.io-client';
import { SocketContext, SocketContextType } from "../context/socket";


let initRooms: RoomsOfUser[] = [] as RoomsOfUser[];

const Rooms = () => {
	const [rooms, setRooms] = useState(initRooms);
	const logged_user = useSelector((state: RootState) => state.user).login;
	const currentRoom = useSelector((state: RootState) => state.chat).curr_room;
	const { socket } = useContext(SocketContext) as SocketContextType;


	function getRooms() {
		getMyRooms().then((value) => {
			if ((typeof value) === (typeof rooms)) {
				const data = value as RoomsOfUser[];
				setRooms(data);
			}
		})
			.catch((reason: string) => {
				console.log("Error ;Rooms of User", reason)
			})
	}

	const receiveUpdate = () => {
		console.log("check data :  ");
		socket.on('roomsOfUser', (data: { status: boolean, message: string, user: string }) => {
			console.log("check data :  "+data);
			if (data.status)
			{
				// if ( data.user === logged_user)
				// 	// display msg
				getRooms();
			}
			// else
			// 	// display
		})
	}
	
	useEffect(() => {
		// Get Rooms
		if (rooms.length === 0)
			getRooms();
		if (socket.connected)
			receiveUpdate();
		return () => {
			console.log("clear rooms");
			// setRooms(initRooms);
		}
	}, [currentRoom])

	return (
		<Box
			sx={{
				backgroundColor: "#202541",
				height: '100vh',
				padding: '30px'

			}}>
			<Stack height="100%">
				<Stack spacing={1} direction="row">
					<IconButton>
						<img src={roomIcon} width="36px" alt='roomIcon' />
					</IconButton>
					<div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
						<Typography sx={{
							fontWeight: '700',
							fontSize: '28px',
							lineHeight: '109.52%',

						}}>
							Chat Room
						</Typography>
					</div>
				</Stack>
				<Stack spacing={3} direction="row" margin="40px 35px 20px 9px">
					<Typography sx={{
						fontWeight: '600',
						fontSize: '22px',
						lineHeight: '109.52%',

					}}>
						Rooms
					</Typography>
					<div className='dot-nb center-button'>
						{rooms.length}
					</div>
					<div style={{
						marginLeft: "auto",
					}}>
						<Typography sx={{
							fontWeight: '400',
							fontSize: '14px',
							lineHeight: '109.52%',
							textDecorationLine: 'underline',
							marginTop: "3%",
							cursor: "pointer"
						}}>
							Create new room
						</Typography>
					</div>
				</Stack>
				<List style={{ overflow: 'auto', height: "100%" }} >
					{rooms.length && rooms.map((item: RoomsOfUser) => (
						<li key={item.id} className='item-friend'>
							<RoomButtonChat room={item} socket={socket} />
						</li>
					))}

				</List>
			</Stack>

		</Box>
	)
}

export default Rooms
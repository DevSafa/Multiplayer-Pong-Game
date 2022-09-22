import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HttpsIcon from '@mui/icons-material/Https';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';

import * as React from 'react';
import Menu from '@mui/material/Menu';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RoomsOfUser } from '../../requests/rooms';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Socket } from 'socket.io-client';
import { SocketContext, SocketContextType } from "../../context/socket";

function leaveRoom(socket:Socket){
	if (socket)
	{
		socket.emit('leaveRoom');
		console.log("leave room:");
	}
}


export default function DropMenuRoom(Props: {room:RoomsOfUser, socket:Socket}) {

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: "#3D4060"
					}
				}}
			>
				<Box sx={{ maxWidth: 360 }}>
					<nav aria-label="main folders">
						{Props.room.user_role !== 'owner' &&
							<List dense={true} >
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose(); leaveRoom(Props.socket) }}>
										<ListItemIcon>
											<ExitToAppIcon />
										</ListItemIcon>
										<ListItemText primary="Leave" />
									</ListItemButton>
								</ListItem>
							</List>}
						{Props.room.user_role === 'owner' &&
							<List dense={true} >
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose();leaveRoom(Props.socket) }}>
										<ListItemIcon>
											<ExitToAppIcon />
										</ListItemIcon>
										<ListItemText primary="Leave" />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose() }}>
										<ListItemIcon>
											<HttpsIcon />
										</ListItemIcon>
										<ListItemText primary="Change the password" />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose() }}>
										<ListItemIcon>
											<NoEncryptionIcon />
										</ListItemIcon>
										<ListItemText primary="Disbale password" />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={() => { handleClose() }}>
										<ListItemIcon>
											<GroupAddIcon />
										</ListItemIcon>
										<ListItemText primary="Invite a user" />
									</ListItemButton>
								</ListItem>
							</List>}
					</nav>
					<Divider />
				</Box>
			</Menu>
		</div>
	);
}


// leave
/**

 * if (false)
 * 		client.emit(  "userRooms" , {"false" , message ,user  :"current"})
 *	else
 * 		client.emit( "userRooms" , {status : true  , message : "" , user  :current}) 
 * 		server.to(room).emit("usersOfRoom" ,{status : true , message : "" , user : current})
 */

/*

	changePassword(password:string)  - Disable
	if false
		client.emit("userRooms" ,{status : false , message : "" , user : current })
	else
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })

	
*/

/**
 * 
 *  invite user (new_user : string)
 * if (false)
 * {
 * 		client.emit("userRooms" , {status : false , message : "" , user : current (lidar l'action)})
 * }
 * else
 * {
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })
		server.to(room).emit("usersOfRoom" ,{status : true })
	  }
 */

/**
 * 
	setAdmin(new_admin : string )
	if(false)
		client.emit("userRooms" ,{status : false , message : "" , user : current })
	else
	{
		server.to(room).emit("userRooms" , {status : true , message : "" , user : current })
		server.to(room).emit("usersOfRoom" ,{status : true })
		
	}
 */


/**
 * 
 * Ban (new_ban : string)
 * if(false)
 * {
 * 		client.emit("userRooms" ,{status : false , message : "" , user : current })
 * }else
 * {
 * 		server.to(room).emit("userRooms" , {status : true , message : "" , user : current }) 
 * 		server.to(room).emit("usersOfRoom" ,{status : true })
 * 		server.to(room).emit("zwa99" ,{status : true , user : new_ban})
 * 		

 * }
 * 
 */
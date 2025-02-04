
import './App.css';
import Main from './components/Main'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatGlobal from './components/ChatGlobal';
import { useSelector } from 'react-redux';
import { RootState } from "./store";

import LoginPage from './components/LoginPage';
import { NavBarNew } from './components/NavBarNew';
import { Box, Stack } from '@mui/material';
import { LiveMatchs } from './components/LiveMatchs';
import { DashboardUser } from './components/DashboardUser';
import { InterfaceEnum } from './store/interfacesReducer';
import { InvitationFriend } from './components/InvitationFriend&Game/InvitationFriend';
import { InvitationsMenu } from './components/InvitationsMenu';
import InvitePlayBar from './components/InvitePlayBar';
import ChatUIFriend from './components/ChatUIFriend';
import MessageSent from './components/MessageSent';
import MessageRecieved from './components/MessageRecieved';
import Rooms from './components/Rooms';
import { UsersRoom } from './components/UsersRoom';
import Friends from './components/Friends';
import { useDispatch } from 'react-redux';
import { clearUser, initUser } from './store/userReducer';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Login } from '@mui/icons-material';
import RoomButtonChat from './components/RoomButtonChat';
import SocketProvider, { socket, SocketContext } from './context/socket';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},

	typography: {
		fontFamily: [
			"Lexend",
			"sans-serif"
		].join(",")
	}
});


function App() {
	const dispatch = useDispatch();
	const logged_user = useSelector((state: RootState) => state.user).login;
	const currentIterface = useSelector((state: RootState) => state.interfaces).current;
	const [cookies, setCookie, removeCookie] = useCookies();
	

	useEffect(() => {
		if (cookies.Authorization) {
			dispatch(initUser({ login: cookies.login, username: cookies.username, avatar: cookies.avatar }));
			console.log("User token: " + cookies.Authorization);
		}

		if (currentIterface === InterfaceEnum.Logout) {
			removeCookie("login"); removeCookie("username"); removeCookie("avatar"); removeCookie("Authorization");
			dispatch(clearUser());
		}

	}, [logged_user, currentIterface])

	return (
		<ThemeProvider theme={darkTheme}>
			<SocketProvider>
				<CssBaseline />
				{logged_user === '' && <LoginPage />}
				{logged_user !== '' &&
					<Stack direction="row"
						sx={{ backgroundColor: "#202541", width: "100%", height: "100%" }}>
						<NavBarNew />
						{currentIterface === InterfaceEnum.Home && <Main />}
						{currentIterface === InterfaceEnum.Dashboard && <DashboardUser />}
						{currentIterface === InterfaceEnum.ChatRoom && <ChatGlobal />}
						{currentIterface === InterfaceEnum.InstantMessaging && <ChatGlobal />}
						{currentIterface === InterfaceEnum.Friends && <ChatGlobal />}
						{currentIterface === InterfaceEnum.Matchmaking && <Box />}
						{currentIterface === InterfaceEnum.LiveGames && <LiveMatchs />}
					</Stack>
				}
			</SocketProvider>
		</ThemeProvider>
	);
}

// function 
//Snackbar MUI to handle Invite Play
export default App;
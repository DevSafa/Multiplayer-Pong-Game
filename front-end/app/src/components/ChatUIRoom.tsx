import { Button, FormControl, InputBase, List, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import HeaderChat from './HeaderChat'
import SendIcon from '@mui/icons-material/Send'
import MessageSent from './MessageSent';
import MessageRecieved from './MessageRecieved';
import { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store";
import { addMessage, clearMessages, initMessages, MessageState } from "../store/chatUiReducer";
import { requestMessages } from '../requests/messages';
import { io, Socket } from 'socket.io-client';
import { SocketContext, SocketContextType } from '../context/socket';

let index_msg: number = 0;
// let socket: Socket;
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: '12px 0 0 12px',
        position: 'relative',
        backgroundColor: "#151416",
        // border: '1px solid #ced4da',
        fontSize: 13,
        width: '440px',
        height: '45px',
        padding: '10px 20px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
    },
}));

const renderMessage = (current: string, from: string, msg: string): JSX.Element => {
    if (current === from)
        return (
            <li key={index_msg++} style={{ float: 'right' }}>
                <MessageSent msg={msg} />
            </li>
        );
    else
        return (
            <li key={index_msg++} style={{ float: 'left' }}>
                <MessageRecieved msg={msg} />
            </li>
        );
}

/* Handle Clear msgs when switch room */
const ChatUIRoom = () => {
    const dispatch = useDispatch();
    const bottomRef = useRef<HTMLDivElement>(null); // To auto scroll to bottom of window
    const logged_user = useSelector((state: RootState) => state.user).login;
    const currentRoom = useSelector((state: RootState) => state.chat).curr_room;

    const msgs = useSelector((state: RootState) => state.chat).msgs;
    const { socket } = useContext(SocketContext) as SocketContextType;

    const [message_input, setMessage] = useState("");

    const recieveMsgs = () => {
        socket.on('msgToClient', (msg: MessageState) => {
            dispatch(addMessage(msg));
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        })
    }

    const initMsgs = () => {
        requestMessages(currentRoom).then((value) => {
            const data = value as Array<MessageState>;
            if ((typeof data) === (typeof msgs))
                dispatch(initMessages(data));
        })
    }

    const handleMsgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }
    // Delete setMsgs 
    const sendMsg = () => {
        if (message_input) {
            if (socket) {
                socket.emit('SendMessageRoom', { msg: message_input });
            }
            setMessage('');
        }
    }

    const handleEnterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            sendMsg();
        }
    }


    useEffect(() => {
        console.log("chatUIRoom");

        if (currentRoom !== '')
            initMsgs();

        if (socket)
            recieveMsgs();
        
        if (bottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        
        return () => {
            console.log("clear rooms");
            dispatch(clearMessages());
            // if (socket)
            //     socket.disconnect();
        }

    }, [socket])

    return (
        <Box
            bgcolor="#202541"
            sx={{
                backgroundColor: "#202541",
                width: "510px",
                height: '100vh',
                // height: 'calc( 100vh - 67px )',
                paddingLeft: "22px",
                paddingRight: "20px",
                borderLeft: "1px solid #FFFFFF"
            }}>
            <Stack height='inherit'>
                <div>
                    <HeaderChat name={currentRoom} />
                </div>
                <Stack spacing={2} direction="column-reverse" sx={{ width: "100%", minHeight: "calc( 100vh - 67px )", margin: 'auto' }}>
                    <Stack direction="row" marginBottom="35px">
                        <FormControl variant="standard">
                            <BootstrapInput placeholder="Write a message ..." id="bootstrap-input"
                                onChange={handleMsgChange}
                                onKeyDown={handleEnterkey}
                                value={message_input} />
                        </FormControl>
                        <div style={{
                            backgroundColor: "#151416", padding: "10px", borderRadius: '0 10px 10px 0',
                        }}>
                            <Button sx={{ backgroundColor: "#3475D7", height: "45px", color: "#FFF" }} onClick={sendMsg}>
                                <SendIcon />
                            </Button>
                        </div>
                    </Stack>
                    <List style={{ overflow: 'auto' }} >
                        {msgs && msgs.map((item) => (renderMessage(logged_user, item.from, item.msg)))}
                        <li key={index_msg++} style={{ float: 'right' }}>
                            <div ref={bottomRef} ></div>
                        </li>
                    </List>
                </Stack>
            </Stack>
        </Box>
    )
}

export default ChatUIRoom
import { Button, FormControl, InputBase, List, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import HeaderChat from './HeaderChat'
import SendIcon from '@mui/icons-material/Send'
import MessageSent from './MessageSent';
import MessageRecieved from './MessageRecieved';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store";
import { addMessage, clearMessages, initMessages, MessageState } from "../store/chatUiReducer";
import { requestDirectMsgs } from '../requests/messages';

let index_msg: number = 0;
let socketclient: Socket;

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: '12px 0 0 12px',
        position: 'relative',
        backgroundColor: "#151416",
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

// const msgs = Array.from({ length: 9 }, (_, index) => {return ()}
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
const ChatUIFriend = () => {

    const dispatch = useDispatch();
    const bottomRef = useRef<null | HTMLDivElement>(null); // To auto scroll to bottom of window
    const logged_user = useSelector((state: RootState) => state.user).login;
    const chat_state = useSelector((state: RootState) => state.chat);

    const currentConvr = chat_state.curr_converation;
    const msgs = chat_state.msgs;

    const [message_input, setMessage] = useState("");
    useEffect(() => {
        console.log("chatUIFriend");

        if ((!socketclient || socketclient.disconnected) && currentConvr !== '') {
            socketclient = io(process.env.REACT_APP_SERVER_IP as string, {
                auth: {
                    from: logged_user,
                    to: currentConvr,
                }
            });
        }
        handleConnection();
        // requestDirectMsgs(currentConvr).then((value) => {
        //     const data = value as Array<MessageState>;
        //     dispatch(initMessages(data));
        // })

        if (socketclient) {
            socketclient.on('msgToClient_dm', (m: MessageState) => {
                dispatch(addMessage(m));
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                console.log(msgs);
            })
        }

        if (bottomRef) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        return () => {
            console.log("clear");
            dispatch(clearMessages());
            if (socketclient)
                socketclient.disconnect();
        }
    }, [currentConvr])



    const handleMsgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }
    // Delete setMsgs 
    const sendMsg = () => {
        if (message_input) {
            if (socketclient) {
                socketclient.emit('dm_message', { message: message_input });
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
            setMessage('');
        }
    }
    const handleEnterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            sendMsg();
        }
    }

    return (
        <Box
            bgcolor="#202541"
            sx={{
                backgroundColor: "#202541",
                width: "510px",
                height: '100vh',
                paddingLeft: "22px",
                paddingRight: "22px",
                borderLeft: "1px solid #FFFFFF"
            }}>
            <Stack height='inherit'>
                <div>
                    <HeaderChat name={currentConvr} />
                </div>
                <Stack spacing={2.7} direction="column-reverse" sx={{ width: "100%", minHeight: "calc( 100vh - 67px )", margin: 'auto' }}>
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
                    <List style={{ overflowY: 'auto' }} >
                        {msgs.map((item) => (renderMessage(logged_user, item.from, item.msg)))}
                        <li key={index_msg++} style={{ float: 'right' }}>
                            <div ref={bottomRef} ></div>
                        </li>
                    </List>
                </Stack>
            </Stack>
        </Box>
    )
}

const handleConnection = () => {
    if (socketclient) {
        socketclient.emit('join_dm_room');
    }
}

export default ChatUIFriend
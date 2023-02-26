import React, {useEffect, useState} from "react";
import Paper from '@mui/material/Paper';
import { Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { ProjectState } from "../../context/projectProvider";
import axios from "axios";
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import ScrollableFeed from 'react-scrollable-feed'

// #socket io
import io from 'socket.io-client';
const ENDPOINT = "https://neurolab-space-api.onrender.com";
var socket, selectedChatCompare;


const Chat = ({openDyDashSummary}) => {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState();
    const {loggedUser, selectedChat, setSelectedChat, notification, setNotification } = ProjectState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

     // #socket io
    const [ioConnect, setIoConnect] = useState(false);
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', loggedUser)
        socket.on('connected', () => {
            setIoConnect(true)
        })
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))

    }, []);
    
    const fetchMessages = async() => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                    headers: {
                        Authorization: `Bearer ${loggedUser.token}`
                    }
            };
            
            const { data } = await axios.get(`/api/messages/${selectedChat._id}`, config);
            setMessages(data);

            // *socket io
            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            console.log(error.message)
        }
    }

    const sendMessage = async () => {
        if (newMsg) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${loggedUser.token}`
                    }
                };
                
                setNewMsg("");
                const { data } = await axios.post("/api/messages", {
                    msg: newMsg,
                    projectId: selectedChat._id,
                }, config);
                
                // *socket
                socket.emit('new message', data)
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error)
            }
        }
    };

    const typingHandler = (e) => {
        setNewMsg(e.target.value)

        if (!ioConnect) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        };

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message received", (newMs) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMs.project._id) {
               
            } else {
                setMessages([...messages, newMs])
           }
       })

    });

    return (
        <div className="dynamic">
            <div className="chat-info">
                
                <div className="istyping">
                    {isTyping ? <h5 className="warning">user is typing...</h5> : (<></>)}
                </div>
                <h3 className=''>Project: <span className="">{selectedChat.projectName}</span></h3>
                <Tooltip title='close'>
                    <CloseIcon className="icon primary" onClick={openDyDashSummary} />
                </Tooltip>
                
            </div>
            <div className="chat-box">
                <div className="messages">
                    <div
                        className="chat-space"
                        sx={{
                
                        }}
                    >
                            <ScrollableFeed  className="chat-space">
                                {messages.length !== 0 ? messages.map((message) => {
                                if (message.sender._id === loggedUser._id) {
                                    return (
                                        <Paper sx={{ marginTop: '0.8rem', marginLeft: '10rem', marginRight: '0.8rem', padding: '0.5rem' }} elevation={2} key={message._id}>
                                            <div className="msg">
                                        
                                                <h4>{message.msg}</h4>
                                            </div>
                                            <div className="time">
                                                <div>

                                                </div>
                                                <div>
                                                    <h5 className="text-muted">{moment(message.createdAt).calendar()}</h5>
                                                </div>
                                            </div>
                                        </Paper>
                                    )
                                } else {
                                    return (
                                        <Paper sx={{ marginTop: '0.8rem', marginRight: '10rem', marginLeft: '0.8rem', padding: '0.5rem' }} elevation={2} key={message._id}>

                                                <div className="msg-box">
                                                    <div className="name">
                                                        <h5 className="primary">{message.sender.name}</h5>
                                                    </div>
                                                    
                                                    <h4>{message.msg}</h4>
                                                    <div className="time">
                                                        <div>

                                                        </div>
                                                        <div>
                                                            <h5 className="text-muted">{moment(message.createdAt).calendar()}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                        </Paper>
                                    )
                                }
                            }) : ''}
                            </ScrollableFeed>
             
                    </div>
                    <div
                        className="msg-input"
                    >
                        <div>
                            
                            <TextField
                                sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', marginTop: '1rem', }}
                                inputProps={{ sx: { fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.7rem', width: '25vw' } }}
                                id="standard-multiline-flexible"
                                multiline
                                maxRows={3}
                                variant="standard"
                                onChange={(e) => typingHandler(e)}
                                value={newMsg}
                            />
                        </div>
                        <div className="send-msg">
                            <div>

                            </div>
                            <div>
                                <SendIcon className="icon" sx={{ bgcolor: '#7380ec', color: 'white', padding: '0.5rem', margin: '0.5rem', width: '2rem', height: '2rem' }} onClick={sendMessage} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="input">
                          
                </div>
            </div>
        </div>
    );
};

export default Chat
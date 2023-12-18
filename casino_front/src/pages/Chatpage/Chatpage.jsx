import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import socket from '../../server';
import MessageContainer from '../../components/MessageContainer/MessageContainer';
import InputField from '../../components/InputField/InputField';
import { Button } from '@mui/base/Button';
import './Chatpage.scss';
import BlackjackGame from '../../components/BlackJack/BlackJack';

const ChatPage = ({ user }) => {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState('');
    const { id: rid } = useParams();
    const navigate = useNavigate();

    const leaveRoom = () => {
        socket.emit('leaveRoom', (res) => {
            if (res.ok) navigate('/');
        });
    };

    useEffect(() => {
        socket.emit('joinRoom', rid, (res) => {
            if (res && res.ok) {
                console.log('successfully join', res);
            } else {
                console.log('fail to join', res);
            }
        });

        socket.on('message', (res) => {
            console.log('message', res);
            setMessageList((prevState) => prevState.concat(res));
        });
    }, [rid]);

    const sendMessage = (event) => {
        event.preventDefault();
        socket.emit('sendMessage', message, (res) => {
            if (!res.ok) {
                console.log('error message', res.error);
            }
            setMessage('');
        });
    };

    return (
        <div className='game-room'>
            <nav>
                <Button onClick={leaveRoom} className='back-button'>
                    ←
                </Button>
                <div className='nav-user'>{user.name}</div>
            </nav>
            <div className='game-table'>
                <BlackjackGame />
            </div>
            <div className='message-box'>
                {messageList.length > 0 ? <MessageContainer messageList={messageList} user={user} /> : null}
                <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
};

export default ChatPage;

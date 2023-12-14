import { useEffect, useState } from 'react';
import './App.css';
import socket from './server';
import InputField from './components/InputField/InputField';
import MessageContainer from './components/MessageContainer/MessageContainer';

function App() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        socket.on('message', (message) => {
            console.log('message', message);
            setMessageList((prevState) => prevState.concat(message));
        });
        askuserName();
    }, []);

    const askuserName = () => {
        const userName = prompt('아이디를 입력하세요');
        console.log('userName', userName);

        socket.emit('login', userName, (res) => {
            console.log('login', res);
            if (res?.ok) {
                setUser(res.data);
            }
        });
    };

    const sendMessage = (event) => {
        event.preventDefault();
        socket.emit('sendMessage', message, (res) => {
            console.log('sendmessage res', res);
        });
    };
    return (
        <div>
            <div className='App'>
                <MessageContainer messageList={messageList} user={user} />
                <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default App;

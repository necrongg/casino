import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import RoomListPage from './pages/RoomListPage/RoomListPage';
import ChatPage from './pages/Chatpage/Chatpage';
import socket from './server';

function App() {
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        socket.on('rooms', (res) => {
            setRooms(res);
        });

        askuserName();
    }, []);

    const askuserName = () => {
        const userName = prompt('아이디를 입력하세요');

        socket.emit('login', userName, (res) => {
            console.log('login', res);
            if (res?.ok) {
                setUser(res.data);
            }
        });
    };

    return (
        <>
            <ToastContainer
                position='top-right'
                autoClose={2500}
                limit={5}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme='colored'
            />
            <Routes>
                <Route exact path='/' element={<RoomListPage rooms={rooms} />} />
                <Route exact path='/room/:id' element={<ChatPage user={user} />} />
            </Routes>
        </>
    );
}

export default App;

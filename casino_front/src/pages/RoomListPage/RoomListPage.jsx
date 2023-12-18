import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RoomListPage.css';
import socket from '../../server.js';

import { useState } from 'react';

const RoomListPage = ({ rooms }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [roomData, setRoomData] = useState({
        roomName: '',
        password: '',
        gameType: 'black_jack',
        limitPerson: 2,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
    };

    const handleLimitPersonChange = (e) => {
        const limit = parseInt(e.target.value);
        setRoomData({ ...roomData, limitPerson: limit });
    };

    const handleGameTypeChange = (e) => {
        const gameType = e.target.value;
        setRoomData({ ...roomData, gameType });
    };

    const handleSubmit = () => {
        if (roomData.roomName.trim() !== '') {
            createNewRoom(roomData);
        } else {
            toast.error('방 이름을 입력해주세요');
        }
    };

    const createNewRoom = async () => {
        if (roomData) {
            socket.emit('createRoom', roomData, (res) => {
                if (res.ok) {
                    console.log('방이 성공적으로 생성되었습니다.');
                    navigate(`/room/${res.room._id}`);
                } else {
                    console.error('방 생성에 실패했습니다:', res.error);
                }
            });
        }
    };

    const navigate = useNavigate();

    const moveToChat = (rid) => {
        navigate(`/room/${rid}`);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div className='room-body'>
            <div className='room-nav'>채팅 ▼</div>

            {rooms.length > 0
                ? rooms.map((room, index) => (
                      <div className='room-list' key={index} onClick={() => moveToChat(room._id)}>
                          <div className='room-title'>
                              <img src='/profile.jpeg' alt='profile' />
                              <p>{room.room}</p>
                          </div>
                          <div className='member-number'>{room.members.length}</div>
                      </div>
                  ))
                : null}

            <button onClick={togglePopup}>방 생성</button>

            {showPopup && (
                <div className='popup'>
                    <h2>방 정보 입력</h2>
                    <input
                        type='text'
                        name='roomName'
                        placeholder='방 이름을 입력하세요'
                        onChange={handleInputChange}
                    />
                    <input
                        type='text'
                        name='password'
                        placeholder='비밀번호를 입력하세요'
                        onChange={handleInputChange}
                    />
                    <select name='limitPerson' onChange={handleLimitPersonChange}>
                        {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                                {num}명
                            </option>
                        ))}
                    </select>

                    <label>
                        <input
                            type='radio'
                            name='gameType'
                            value='black_jack'
                            onChange={handleGameTypeChange}
                            defaultChecked
                        />
                        블랙잭
                    </label>
                    <label>
                        <input type='radio' name='gameType' value='poker' onChange={handleGameTypeChange} />
                        포커
                    </label>
                    <label>
                        <input type='radio' name='gameType' value='texas_hold_em' onChange={handleGameTypeChange} />
                        텍사스홀덤
                    </label>
                    <button onClick={handleSubmit}>방 생성</button>
                </div>
            )}
        </div>
    );
};

export default RoomListPage;

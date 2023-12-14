import { useNavigate } from 'react-router-dom';
import './RoomListPage.css';
import socket from '../../server.js';

const RoomListPage = ({ rooms }) => {
    const createNewRoom = async () => {
        const roomName = prompt('방 이름을 입력하세요.');

        if (roomName) {
            // 유저가 취소하지 않고 방 이름을 입력한 경우에만 실행
            socket.emit('createRoom', roomName, (res) => {
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

            <button onClick={createNewRoom}>방 생성</button>
        </div>
    );
};

export default RoomListPage;

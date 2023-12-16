import Room from '../Models/room.js';

export const getAllRooms = async () => {
    const roomList = await Room.find({});

    return roomList;
};

export const createRoom = async (roomData) => {
    try {
        const newRoom = new Room({
            room: roomData.roomName,
            password: roomData.password,
            game_type: roomData.gameType,
            limit_person: roomData.limitPerson,
            members: [],
        });

        const savedRoom = await newRoom.save();
        return savedRoom;
    } catch (error) {
        throw new Error('방 생성에 실패했습니다: ' + error.message);
    }
};

export const joinRoom = async (roomId, user) => {
    // 방 입장
    const room = await Room.findById(roomId);
    if (!room) {
        throw new Error('해당 방이 없습니다.');
    }
    if (!room.members.includes(user._id)) {
        room.members.push(user._id);

        if (room.admin.length === 0) {
            room.admin.push(user._id);
        }

        await room.save();
    }
    user.room = roomId;
    await user.save();
};

export const leaveRoom = async (user) => {
    // 방 퇴장
    const room = await Room.findById(user.room);
    if (!room) {
        throw new Error('Room not found');
    }

    room.members.remove(user._id);

    await room.save();

    // 마지막 인원이 나가면 방 삭제
    if (room.members.length === 0) {
        await Room.deleteOne({ _id: room._id });
    }
};

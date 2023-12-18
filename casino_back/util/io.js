import { saveChat } from '../Controllers/chat/chat.controller.js';
import { createRoom, getAllRooms, joinRoom, leaveRoom, getRoom } from '../Controllers/chat/room.controller.js';
import { checkUser, saveUser } from '../Controllers/chat/user.controller.js';

export default function setupIO(io) {
    async function sendLeaveMessage(user, socket, io) {
        const leaveMessage = {
            chat: `${user.name} left this room`,
            user: { id: null, name: 'system' },
        };
        socket.broadcast.to(user.room.toString()).emit('message', leaveMessage);
        io.emit('rooms', await getAllRooms());
        socket.leave(user.room.toString());
    }

    io.on('connection', async (socket) => {
        socket.emit('rooms', await getAllRooms());

        socket.on('createRoom', async (roomData, cb) => {
            try {
                const newRoom = await createRoom(roomData);

                cb({ ok: true, room: newRoom });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('joinRoom', async (rid, cb) => {
            try {
                const user = await checkUser(socket.id);
                await joinRoom(rid, user);
                socket.join(user.room.toString());

                const welcomeMessage = {
                    chat: `${user.name} is joined to this room`,
                    user: { id: null, name: 'system' },
                };

                io.to(user.room.toString()).emit('message', welcomeMessage);
                io.to(user.room.toString()).emit('roomInfo', await getRoom(rid));

                io.emit('rooms', await getAllRooms());

                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('leaveRoom', async (cb) => {
            try {
                const user = await checkUser(socket.id);
                await leaveRoom(user);
                await sendLeaveMessage(user, socket, io);

                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, message: error.message });
            }
        });

        socket.on('login', async (userName, cb) => {
            try {
                const user = await saveUser(userName, socket.id);
                cb({ ok: true, data: user });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('sendMessage', async (receivedMessage, cb) => {
            try {
                const user = await checkUser(socket.id);
                if (user) {
                    const message = await saveChat(receivedMessage, user);
                    io.to(user.room.toString()).emit('message', message);
                    return cb({ ok: true });
                }
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('disconnect', async () => {
            try {
                const user = await checkUser(socket.id);
                await leaveRoom(user);
                await sendLeaveMessage(user, socket, io);
            } catch (error) {
                console.error(error);
            }
        });
    });
}

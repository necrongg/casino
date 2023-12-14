import { saveChat } from '../Controllers/chat.controller.js';
import { getAllRooms, joinRoom, leaveRoom } from '../Controllers/room.controller.js';
import { checkUser, saveUser } from '../Controllers/user.controller.js';

export default function setupIO(io) {
    io.on('connection', async (socket) => {
        socket.emit('rooms', await getAllRooms());

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
                io.emit('rooms', await getAllRooms());
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('leaveRoom', async (_, cb) => {
            try {
                const user = await checkUser(socket.id);
                await leaveRoom(user);
                const leaveMessage = {
                    chat: `${user.name} left this room`,
                    user: { id: null, name: 'system' },
                };
                socket.broadcast.to(user.room.toString()).emit('message', leaveMessage); 
                io.emit('rooms', await getAllRooms());
                socket.leave(user.room.toString()); 
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

        socket.on('disconnect', () => {
            console.log('user is disconnect');
        });
    });
}

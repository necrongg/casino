import { saveChat } from '../Controllers/chat.controller.js';
import { checkUser, saveUser } from '../Controllers/user.controller.js';

export default function setupIO(io) {
    io.on('connection', async (socket) => {
        console.log('client is connected', socket.id);

        socket.on('login', async (userName, cb) => {
            try {
                const user = await saveUser(userName, socket.id);
                const welcomeMessage = {
                    chat: `${user.name} is joined to this room`,
                    user: { id: null, name: 'system' },
                };
                io.emit('message', welcomeMessage);
                cb({ ok: true, data: user });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('sendMessage', async (message, cb) => {
            try {
                const user = await checkUser(socket.id);
                const newMessage = await saveChat(message, user);
                io.emit('message', newMessage);
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('user is disconnect');
        });
    });
}

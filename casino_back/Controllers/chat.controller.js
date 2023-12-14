import Chat from '../Models/chat.js';

export const saveChat = async (message, user) => {
    const newChat = new Chat({
        chat: message,
        user: {
            id: user._id,
            name: user.name,
        },
        room: user.room,
    });
    await newChat.save();

    return newChat;
};

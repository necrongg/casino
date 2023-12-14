import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
    {
        chat: String,
        user: {
            id: {
                type: Schema.ObjectId,
                ref: 'User',
            },
            name: String,
        },
        room: {
            type: Schema.ObjectId,
            ref: 'Room',
        },
    },
    { timestamp: true },
);

export default model('Chat', chatSchema);

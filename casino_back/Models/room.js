import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
    {
        room: String,
        password: String,
        game_type: String,
        limit_person: Number,

        admin: [
            {
                type: Schema.ObjectId,
                ref: 'User',
            },
        ],

        members: [
            {
                type: Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamp: true },
);
export default model('Room', roomSchema);

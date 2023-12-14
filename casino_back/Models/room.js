import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
    {
        room: String,
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

import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
    {
        room: String,

        limit_person: {
            type: Number,
            default: 8,
        },

        isPublic: {
            type: Boolean,
            default: true,
        },

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

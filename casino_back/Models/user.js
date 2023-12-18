import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    // 유저 기본정보
    name: {
        type: String,
        required: [true, 'User must type name'],
        unique: true,
    },
    token: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    },
    online: {
        type: Boolean,
        default: false,
    },

    // 방입장시 유저 정보
    room: {
        type: Schema.ObjectId,
        ref: 'Room',
    },
    seatNumber: {
        type: Number,
        default: null,
    },

    //게임진행시 유저 정보
    betAmount: {
        type: Number,
        default: 0,
    },
    bettingHands: [
        {
            cards: [],
            betAmount: {
                type: Number,
                default: 0,
            },
            isActive: {
                type: Boolean,
                default: false,
            },
        },
    ],
});
export default model('User', userSchema);

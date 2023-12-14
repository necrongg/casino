import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User must type name'],
        unique: true,
    },
    token: {
        type: String,
    },
    online: {
        type: Boolean,
        default: false,
    },
    room: {
        type: Schema.ObjectId,
        ref: 'Room',
    },
});
export default model('User', userSchema);

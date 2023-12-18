import User from '../../Models/user.js';

export const saveUser = async (userName, sid) => {
    let user = await User.findOne({ name: userName });
    if (!user) {
        user = new User({
            name: userName,
            token: sid,
            online: true,
        });
    }
    user.token = sid;
    user.online = true;

    await user.save();

    return user;
};

export const checkUser = async (sid) => {
    const user = await User.findOne({ token: sid });

    if (!user) throw new Error('user not found');
    return user;
};

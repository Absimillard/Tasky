const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const generateAccessToken = (userId, privilege, status) => {
    return jwt.sign({ 
        sub: userId,
        privilege,
        status 
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const checkAuth = async (req, res, io, User) => {
    try {
        const { Authorization: refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No Authorization found' });
        }

        const user = await User.findOne({ refreshToken });

        if (!user) {
            return res.sendStatus(403);
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = new ObjectId(decoded.sub);

        if (user._id.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'No user found' });
        }

        const accessToken = generateAccessToken(user._id, user.privilege, user.status);
        const checkedUser = {
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            status: user.status,
            privilege: user.privilege,
            email: user.email,
        };
        console.log('Auth-check was a success !');
        
        // io.emit('checkedUser', { accessToken });
        return res.json({ user: checkedUser, accessToken });

    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: 'Login failed' });
    }
};

module.exports = () => ({
    checkAuth,
});

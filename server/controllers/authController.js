const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logIn = async (req, res, io, User) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const hashMatch = bcrypt.compareSync(password, user.password);

        if (!hashMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const exp = Date.now() + 1000 * 60 * 60 * 24 * 1; // 1 days
        const accessToken = jwt.sign({ 
            sub: user._id,
            privilege: user.privilege, 
            status: user.status 
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });

        const refreshToken = jwt.sign({ 
            sub: user._id,
            privilege: user.privilege, 
            status: user.status 
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: exp });
        
        const loggedUser = {
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            status: user.status,
            privilege: user.privilege,
            email: user.email,
        };
        
        io.emit('loggedUser', loggedUser);
        await User.findByIdAndUpdate(user._id, {
            refreshToken: refreshToken,
        });
        // Set HttpOnly cookie on the response
        res.cookie('Authorization', refreshToken, { httpOnly: true, exp, sameSite: 'lax' }); // add secure: true for production
        res.json({ user: loggedUser, accessToken });

    } catch(err) {
        console.error(err);
        return res.status(403).json({ error: 'Login failed' });
    }
    
};
const logOut = async (req, res, User) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.autorization) return res.sendStatus(204);
        const refreshToken = cookies.autorization;
        const user = User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('Authorization', { httpOnly: true, exp, sameSite: 'lax', }); // add secure: true for production
            return res.sendStatus(204);
        }
        await User.findByIdAndUpdate(user._id, {
            refreshToken: null,
        });
        res.clearCookie('Authorization', { httpOnly: true, exp, sameSite: 'lax' }); // add secure: true for production
       } catch(err) {
        console.error(err);
        return res.status(403).json({ error: 'Login failed' });
    }
};

module.exports= function() {
    return {
        logIn,
        logOut,
    };
};
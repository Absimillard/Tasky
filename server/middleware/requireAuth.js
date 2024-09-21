const jwt = require('jsonwebtoken');


async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({err});
            console.log(decoded) //invalid token
            req.userId = decoded.sub;
            req.privilege = decoded.privilege;
            next();
        }
    );
    } catch (err) {
        console.error(err);
        return res.sendStatus(401);
    }
}

module.exports = requireAuth;

{/*
const token = req.cookies.Authorization;
if (!token) {
            return res.status(401).json({ message: "JWT token is missing" });
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        // Check expiration
        if (Date.now() > decoded.exp) return res.sendStatus(401);
        // Find user using decoded sub
        const user = await User.findOne({ _id: new ObjectId(decoded.sub) });
        
        if (!user) return res.sendStatus(401);
        // Attach user to request
        req.user = user;
        // Continue on

*/}
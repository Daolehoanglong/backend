var jwt = require('jsonwebtoken');

require("dotenv").config()
const CreateJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decoded.id; // Lưu thông tin người dùng vào req
        next();
    });
};





module.exports = {
    CreateJWT, verifyToken
}
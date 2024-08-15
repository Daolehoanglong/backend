var jwt = require('jsonwebtoken');

require("dotenv").config()
const CreateJWT = () => {
    let payload = { name: "long", Address: "TP Ho Chi Minh" }
    let key = process.env.JWT_SECRET
    let token = null
    try {
        let token = jwt.sign(payload, key);
        console.log("token", token);
    } catch (err) {
        console.log(err);
    }
    return token
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET
    let data = null
    // decode tức là toke đã mã hóa
    jwt.verify(token, key, function (err, decoded) {
        if (err) {
            console.log(err);
            return data
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
        }
        console.log(decoded);
        
        return decoded
    });
}




module.exports = {
    CreateJWT,verifyToken
}
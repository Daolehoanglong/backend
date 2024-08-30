const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const UserGG = require('../models/UserGG.js');
const ConfirmationCodes = require('../models/ConfirmationCode.js');
const md5 = require('md5');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require("dotenv").config()
const { CreateJWT, verifyToken } = require('./midlleware/JWTAction.js');

router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/userGG', async (req, res) => {
    try {
        const user = await UserGG.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// login and register users
router.post('/addUser', async (req, res) => {
    const checkEmailGG = await UserGG.findOne({ Email: req.body.Email });
    const checkEmail = await User.findOne({ Email: req.body.Email });
    const PasswordHash = md5(req.body.Password)
    const lastUser = await User.find()
        .sort({ id: -1 })
        .limit(1);
    const Role = 1
    const id = lastUser[0] ? lastUser[0].id + 1 : 1
    const user = new User({
        Name: req.body.Name,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Password: PasswordHash,
        id,
        Role
    })
    if (checkEmailGG != null || checkEmail != null) {
        res.status(201).json({ message: "Email đã có" });
    } else {
        // console.log(user);
        try {
            const newUser = await user.save();
            res.status(201).json(newUser);

        } catch (err) {
            console.error('Error occurred while creating a new photo:', err);
            res.status(500).json({ message: err.message });
        }
    }

});
router.post('/addUserGG', async (req, res) => {
    const checkEmailGG = await UserGG.findOne({ Email: req.body.Email });
    const checkEmail = await User.findOne({ Email: req.body.Email });
    const lastUser = await UserGG.find()
        .sort({ id: -1 })
        .limit(1);
    const id = lastUser[0] ? lastUser[0].id + 1 : 1
    const Role = 0
    const user = new UserGG({
        Name: req.body.Name,
        Email: req.body.Email,
        id,
        Role
    })
    if (checkEmailGG != null || checkEmail != null) {
        res.status(500).json({ message: "Email đã có" });
    } else {
        // console.log(user);
        try {
            const newUser = await user.save();
            res.status(201).json(newUser);

        } catch (err) {
            console.error('Error occurred while creating a new photo:', err);
            res.status(500).json({ message: err.message });
        }
    }
});

router.post('/login', async (req, res) => {
    const checkEmailGG = await UserGG.findOne({ Email: req.body.Email });
    const checkEmail = await User.findOne({ Email: req.body.Email });
    const PasswordHash = md5(req.body.Password)
    // console.log(checkEmail.Password);
    const payload = {
        Email: req.body.Email,
        expressIn: process.env.JWT_EXPIRES_IN
    }
    if (checkEmailGG != null || checkEmail != null) {
        if (checkEmail != null) {
            if (checkEmail.Password == PasswordHash) {
                let token = CreateJWT(payload)
                res.status(201).json({ message: "Hello" });
                // res.status(200).json(token);
            } else {
                res.status(500).json({ message: "sai mật khẩu" });
            }
        } else if (checkEmailGG != null) {
            res.status(501).json({ message: "sai mật khẩu" });
        }
    } else {
        res.status(500).json({ message: "Email không tồn tại" });
    }
});
router.post('/checkCode', async (req, res) => {
    const checkEmailGG = await ConfirmationCodes.findOne({ Code: req.body.Code });
    // console.log(checkEmail.Password);
    if (checkEmailGG != null) {
        res.status(201).json({ message: "thanh cong" });
    } else {
        res.status(500).json({ message: "sai code" });
    }
});

router.patch('/updatePassword', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        console.log(Email);
        
        // Kiểm tra xem Email và Password có được cung cấp
        if (!Email || !Password) {
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc." });
        }

        // Tạo hash của mật khẩu mới (nếu bạn sử dụng md5 hoặc bcrypt)
        const hashedPassword = md5(Password); // hoặc sử dụng bcrypt

        const updatedUser = await User.findOneAndUpdate(
            { Email },
            { $set: { Password: hashedPassword } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User không tìm thấy" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error occurred while updating the user:", err);
        res.status(500).json({ message: err.message });
    }
});



// send mail
router.post("/sendmail", async (req, res) => {
    const lastUser = await ConfirmationCodes.find()
        .sort({ id: -1 })
        .limit(1);
    const id = lastUser[0] ? lastUser[0].id + 1 : 1
    console.log("Request to send email");
    const codeRandom = crypto.randomBytes(3).toString('hex'); // Tạo mã ngẫu nhiên
    const userEmail = req.body.Email; // Lấy email từ body của request
    const checkEmail = await User.findOne({ Email: req.body.Email });
    console.log(userEmail);
    const user = new ConfirmationCodes({
        Code: codeRandom,
        Email: req.body.Email,
        id: id,
    })
    // Kiểm tra email của người dùng
    if (!userEmail || !checkEmail) {
        return res.status(400).json({ message: "Cần địa chỉ email của người nhận." });
    }
    try {
        await user.save();
        await sendMail(codeRandom, userEmail); // Truyền email trực tiếp
        res.status(200).json({ code: codeRandom }); // Trả về mã đã gửi
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
});

async function sendMail(codeRandom, userEmail) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true cho port 465
        auth: {
            user: process.env.EMAIL_USER, // Email từ biến môi trường
            pass: process.env.EMAIL_PASS, // Mật khẩu từ biến môi trường
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail, // Sử dụng chuỗi email trực tiếp
        subject: "Mã xác nhận mật khẩu",
        html: `<h1>Mã của bạn là ${codeRandom}</h1>`, // Nội dung email
    };

    await transporter.sendMail(mailOptions); // Gửi email
}


module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const UserGG = require('../models/UserGG.js');
const md5 = require('md5');
require("dotenv").config()
const { CreateJWT, verifyToken } = require('./midlleware/JWTAction.js');


// test JWT
CreateJWT()
verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibG9uZyIsIkFkZHJlc3MiOiJUUCBIbyBDaGkgTWluaCIsImlhdCI6MTcyMzYxNzE4Mn0.14kw9n3Ay51p6ew7enxipS9t0Q5VPdjQqXNd9FWse6o")
//
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
    
    if (checkEmailGG != null || checkEmail != null) {
        if(checkEmail != null){
            if(checkEmail.Password == PasswordHash){
                res.status(201).json({ message: "Hello" });
            }else{
                res.status(500).json({ message: "sai mật khẩu" });
            }
        }else if(checkEmailGG != null){
            res.status(501).json({ message: "sai mật khẩu" });
        }
    } else {
        res.status(500).json({ message: "Email không tồn tại" });
    }
});




module.exports = router;
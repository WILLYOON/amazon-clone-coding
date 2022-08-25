const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
//CREATE SIGN UP ROUTE
authRouter.post('/api/signup', async (req, res)=> {
    try{
        //get the data from client
        const {name, email, password} = req.body;
        //post that data in database
        const existingUser = await User.findOne({email});
        if(existingUser){
            //Unless specify 400, it will return 200 ok 
            return res.status(400).json({msg: "동일한 이메일의 사용자가 이미 존재합니다."});
        }
        
        const hashedPassword = await bcryptjs.hash(password, 8);

        let user = new User({
            name,
            email,
            password: hashedPassword,
        });

        user = await user.save();
        res.json(user);

    }catch(e){
        res.status(500).json({error: e.message});
    }
    
    //return data to the user
});
//CREAT SIGN IN ROUTE
authRouter.post('/api/signin', async(req, res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({msg: '등록되지 않은 이메일입니다.'});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch){
            return res
            .status(400)
            .json({msg: '비밀번호가 틀립니다.'});
        }
        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});
//CHECK TOKEN VALIDATION
authRouter.post('/tokenisvalid', async(req, res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    }catch(e){
        res.status(500).json({error: e.message});
    }
});

//GET USER DATA
authRouter.get("/", auth, async(req, res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

module.exports = authRouter;
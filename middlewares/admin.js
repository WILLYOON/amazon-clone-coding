const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin = async(req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token)
            return res.status(401).json({msg: "토큰없음. 접근이 거부되었습니다."});
        
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) 
            return res
            .status(401)
            .json({msg: "토큰인증실패!"});

        const user = await User.findById(verified.id);
        if(user.type =="user" || user.type == "seller"){
            return res.status(401).json({msg: "관리자용 메뉴입니다."});
        }
        req.user = verified.id;
        req.token = token;
        next();

    }catch(e){
        res.status(500).json({error: e.message});
    }
};

module.exports = admin;
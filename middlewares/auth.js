const jwt = require("jsonwebtoken");

const auth = async(req, res, next)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token)
        return res.status(401).json({msg: "토큰이 없어 접근이 거부되었습니다."});

        const verified = jwt.verify(token, "passwordKey");
        if(!verified)
        return res
        .status(401)
        .json({msg: "토큰인증이 실패하여 인증이 거부되었습니다."});

        req.user = verified.id;
        req.token = token;
        next();

    }catch(e){
        res.status(500).json({error: e.message});
    }
};

module.exports = auth;
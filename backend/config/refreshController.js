const jwt= require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken=(req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken=cookies.jwt;
    //refresh token
    

    
}
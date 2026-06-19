const jwt = require('jsonwebtoken') ;

async function auth(req,res,next){

    const token = req.cookies.token ;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    
    next() ;

}


module.exports = {auth} ;
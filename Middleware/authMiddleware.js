const jwt = require('jsonwebtoken')

module.exports = function verifyToken(req,res,next){
    const Btoken = req.headers['authorization']
    let token = Btoken.split(' ')[1]
    if(!token){
       return res.status(403).json({error:"No Token Provided"})
    }
    // console.log(token)
    jwt.verify(token,process.env.ADMIN_ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({error:"unathorized"})
        }
        next();
        
    })
}
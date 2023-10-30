const jwt = require('jsonwebtoken')
//function for verifying the token
module.exports = function verifyToken(req,res,next){
    const Btoken = req.headers['authorization']
    
  if (!Btoken) {
    return res.status(403).json({ error: 'No Token Provided' });
  }
    let token = Btoken.split(' ')[1]
   
    // console.log(token)
    jwt.verify(token,process.env.USER_ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({error:"unathorized"})
        }
        next();
        
    })
}






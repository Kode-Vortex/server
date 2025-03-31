import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
export const authenticate = async (req, res , next) => {
    try{
        
        
        
        const {accessToken} = req.cookies;

        

        

        
        if(!accessToken){
            return res.status(201).json({message : "user is not authenticate"})
        }
        
        const decodeToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodeToken._id).select("-password -refreshToken");
        if(!user){
            return res.status(201).json({message : "user is not authenticate"})
        }
        
        req.user = user;
        next();
    }
    catch(error){
        return res.status(500).json({message : "Internal Server error!!!"})
    }


}


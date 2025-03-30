import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
const userSchema = new Schema({

    fullname : {
        type : String,
        required:true,
        trim : true

    },
   
    email : {
        type : String,
        required:true,
        trim : true,
        unique:true
    },
    phone_no:{
        type:Number,
        required:true,
        trim:true,
        match: /^[0-9]{10}$/

    },

    password : {
        type : String,
        required:[true, "Password is required"],
    },
    message : {
        type : String,
        required:[true, "Message is required"],
    },
    
    refreshToken : {
        type : String
    },
    otp: {
        type: String,
        default: null,
      },
      otpExpiry: {
        type: Date,
        default: null,
      }

} , {timestamps:true})

userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")){
        return next()
    }
    try{
        const hashedpassword = await bcrypt.hash(this.password , 10)
        this.password = hashedpassword
        next()
    }catch(error){
        return next(error)
    }
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}


// Generates a JWT access token using the user's data and a secret key.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        fullname : this.fullname,
        
        email : this.email
    } , process.env.ACCESS_TOKEN_SECRET , {expiresIn : process.env.ACCESS_TOKEN_EXPIRY})
}

// Generates a refresh token using the user's _id and a different secret.
userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign({
        _id : this._id,
       
    } , process.env.REFRESH_TOKEN_SECRET , {expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

const User = mongoose.model("User" , userSchema);
export default User;
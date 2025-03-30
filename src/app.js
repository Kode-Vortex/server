import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routers/user.router.js"
import otpRouter from "./routers/otp.router.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
const app = express();
dotenv.config({
    path: "./.env"
})


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// config of diff types of data  acceptance
app.use(express.json())
app.use(express.urlencoded({extended:true , limit:"30kb"}))
app.use(bodyParser.json())
app.use(cookieParser())


app.use("/" , userRouter)
app.use("/" , otpRouter)

export default app;
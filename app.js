import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routers/user.router.js"
import otpRouter from "./routers/otp.router.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import PaymentRouter from "./routers/paymentRoutes.js"

const app = express();
dotenv.config({
    path: "./.env"
})

import ConnectToDataBase from "./config/database.js"

ConnectToDataBase()
.then(() => {
    app.listen(process.env.PORT , () => {
        console.log(`Server Started on port ${process.env.PORT}`);
        
    })
})
.catch(error => {
    console.log("MONGODB connection failed !!!", error);
})


app.use(cors({
    
    origin: "https://www.kodevortex.in" ,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
}))

// config of diff types of data  acceptance
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true , limit:"30kb"}))
app.use(bodyParser.json())



app.use("/" , userRouter)
app.use("/" , otpRouter)
app.use("/" , PaymentRouter)

export default app;
import mongoose from 'mongoose';
import {DB_NAME} from "../constants.js"
const ConnectToDataBase = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    
    try{
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB DB HOST:" , connectionInstance.connection.host);


    }catch(error){
        console.log("MONGODB CONNECTION ERROR" , error);
        process.exit(1);
    }
}

export default ConnectToDataBase
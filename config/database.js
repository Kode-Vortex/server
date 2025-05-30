import mongoose from 'mongoose';
import {DB_NAME} from "../constants.js"
import Workshop from '../models/Workshop.js';
const ConnectToDataBase = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    
    try{
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);

         const workshops = [
      { name: "uiux", availableSeats: 90 },
      { name: "lookerStudio", availableSeats: 90 },
    ];

    for (const ws of workshops) {
      const exists = await Workshop.findOne({ name: ws.name });
      if (!exists) {
        await Workshop.create(ws);
        console.log(`Inserted: ${ws.name}`);
      } else {
        console.log(`Already exists: ${ws.name}`);
      }
    }

    console.log("Seeding complete");
        console.log("Connected to MongoDB DB HOST:" , connectionInstance.connection.host);


    }catch(error){
        console.log("MONGODB CONNECTION ERROR" , error);
        process.exit(1);
    }
}

export default ConnectToDataBase
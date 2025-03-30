import app from "./app.js"
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



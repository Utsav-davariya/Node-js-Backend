import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js"; 

console.log(process.env.MONGODB_URI);



const connectDB = async ()=>{
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n mongodb connected  `);
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default connectDB
import mongoose from "mongoose";
import  {DB_NAME}  from "../constant.js";

console.log(DB_NAME)

const connectDB = async ()=>{
    try {
        const conectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`\n MONGODB Connected !! DB Host:${conectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB Connnection Failed",error)
        process.exit(1)
    }
}

export default connectDB
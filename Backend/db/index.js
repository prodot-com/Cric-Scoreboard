import mongoose from 'mongoose'
import 'dotenv/config'
import {DB_NAME} from '../Constants.js'

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected ☑️ \n DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection failed")
        process.exit(1)
    }
}

export default connectDB
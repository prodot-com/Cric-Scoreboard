import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://Probal2311:Probal2311@probal0.gftxuv1.mongodb.net/Match`)
        console.log(`\n MongoDB connected ☑️ \n DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection failed")
        process.exit(1)
    }
}

export default connectDB
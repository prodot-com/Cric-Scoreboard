import moongoose from 'moongoose'
import 'dotenv/config'

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/Match`)
        console.log(`\n MongoDB connected ☑️ \n DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection failed")
        process.exit(1)
    }
}

export default connectDB
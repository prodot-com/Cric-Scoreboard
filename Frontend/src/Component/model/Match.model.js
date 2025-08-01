import mongoose, {Schema} from "mongoose";

const matchSchema = new Schema({
    creator: String,
    team1: String,
    team2: String
},
{timestamps: true})


export const MatchModel = mongoose.model("Match", matchSchema)
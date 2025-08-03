import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  over: { type: Number, required: true },
  tossWinner: {type: String},
  decision: {type: String}
},{timestamps:true},{
  collection: 'matches'
});

export const Match = mongoose.model("Match", matchSchema);

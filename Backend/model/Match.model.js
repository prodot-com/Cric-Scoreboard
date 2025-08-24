import mongoose from 'mongoose';

const inningsSchema = new mongoose.Schema({
  battingTeam: {type: String},
  bowlingTeam: {type: String},
  runs: {type: Number, default: 0},
  balls: {type: Number, default: 0},
  wickets: {type: Number, default: 0},
},{_id: false})

const matchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  over: { type: Number, required: true },
  tossWinner: {type: String},
  decision: {type: String},
  completed:{type: Boolean},
  firstSummary: inningsSchema,
  secondSummary: inningsSchema,
  
},{timestamps:true,
  collection: 'matches'
});

export const Match = mongoose.model("Match", matchSchema);

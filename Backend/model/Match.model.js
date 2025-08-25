import mongoose from 'mongoose';

const inningsSchema = new mongoose.Schema({
  battingTeam: { type: String, required: true },
  bowlingTeam: { type: String, required: true },
  totalOver: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  matchWinner: { type: String, required: true }  
}, { _id: false });

const matchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  over: { type: Number, required: true },
  batsman1: { type: String, required: true },
  batsman2: { type: String, required: true },
  bowler: { type: String, required: true },
  tossWinner: { type: String },
  decision: { type: String },
  completed: { type: Boolean, default: false },
  firstSummary: { type: inningsSchema},
  secondSummary: { type: inningsSchema},
}, { 
  timestamps: true,
  collection: 'matches'
});

export const Match = mongoose.model("Match", matchSchema);

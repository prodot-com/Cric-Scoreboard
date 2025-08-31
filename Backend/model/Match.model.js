import mongoose from 'mongoose';

const batsmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  out: { type: Boolean, default: false }
}, { _id: false });


const bowlerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  out: { type: Boolean, default: false }
}, { _id: false });


const inningsSchema = new mongoose.Schema({
  battingTeam: { type: String, required: true },
  bowlingTeam: { type: String, required: true },
  totalOver: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  target: {type: Number, default: 0},
  // inningsOver: {type: Boolean, default: false},
  batsman: [batsmanSchema],
  bowler: [bowlerSchema],
  matchWinner: { type: String}  
}, { _id: false });

const matchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  over: { type: Number, required: true },

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

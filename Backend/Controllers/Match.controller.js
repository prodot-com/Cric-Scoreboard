import ApiError from '../Utils/ApiError.js'
import { Match } from '../model/Match.model.js';

const createMatch = async (req, res) => {
    try {
        const { name, team1, team2, over, batsman1, batsman2, bowler } = req.body; // ← FIXED
        console.log(name, team1, team2, over, batsman1, batsman2, bowler)

        if (!name || !team1 || !team2 || !over || !batsman1 || !batsman2 || !bowler) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const match = await Match.create({ name, team1, team2, over, batsman1, batsman2, bowler});

        res.status(201).json(match);
        
        console.log("Created Match ID:", match._id);
        // res.send('Complete')
    } catch (error) {
         console.error("Match Creation Error:", error); 
        throw new ApiError(500, 'Something Went Wrong')
    }
};

const setMatchComplete = async (req, res)=>{
    try {
        
        const {id} = req.params
        console.log("Recieved: ", id)
        const newMatch = await Match.findByIdAndUpdate(id, {
            completed: true
        },
    {
        new: true,
        runValidators: true
    })

    if(!newMatch){
        res.json({
            message: "Cann't change the data"
        })
    }

    res.status(200).json({
      message: "User updated successfully",
      data: newMatch,
    });



    } catch (error) {
        throw new ApiError(500, "Cannot complete match")
    }
}


const deleteMatch = async(req, res)=>{
    try {
        const {id} = req.params;
        console.log("Received ID:", id);

        const result = await Match.findByIdAndDelete(id)

        if(!result){
            return res.status(400).json({message: 'Id not found'})
        }

        res.status(200).json({ message: "Match deleted successfully" })

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong")
    }
}

const getmatch = async(req, res)=>{
    try {
        
        const matches = await Match.find()

        if(!matches){
            return res.status(400).json({message: "No match found"})
        }

        res.status(200).json(matches)

    } catch (error) {
        throw new error(400, "Something went Wrong")
    }
}

const findMatch = async(req, res)=>{
    try {
        const {id}= req.params
        console.log(id)
        const result = await Match.findById(id )

        if(!result){
            return res.status(500).json({message: "Id not found" })
        }
        res.status(200).json({result})

    } catch (error) {
        throw new ApiError(500, 'Something Went Wrong')
    }
}

const addToss = async(req, res)=>{
    try {
        const {id} = req.params
        const {tossWinner, decision} = req.body
        console.log(tossWinner, decision)

        if(!tossWinner || !decision){
            return res.status(400).json({message: 'Details required'})
        }

        const response = await Match.findByIdAndUpdate(id,
            {tossWinner, decision},
            {new: true}
        )

        res.status(200).json({response})

    } catch (error) {
        throw new ApiError(400, "Something Went Wrong")
    }
}

const addFirstSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const firstSummary = req.body;

    if (!firstSummary) {
      return res.status(400).json({ error: "Missing summary" });
    }

    const match = await Match.findByIdAndUpdate(
      id,
      { firstSummary },
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.status(200).json({ message: "Successfully saved", match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addSecondSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const secondSummary = req.body;

    if (!secondSummary) {
      return res.status(400).json({ error: "Missing summary" });
    }

    const match = await Match.findByIdAndUpdate(
      id,
      { secondSummary },
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.status(200).json({ message: "Successfully saved", match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", error });
  }
};


const fetchFirstSummary = async(req, res)=>{
    try {
        const {id } = req.params


        const data = await Match.findById(id).select('firstSummary');

        if(!res){
            return res.status(400).json({
                message: "Match not found"
            })
        }
        

        res.status(200).json({
            message: 'Successfully fetched first innings summary', data
        })

    } catch (error) {
        console.log("Error fetching Summary: ", error)
    }
}

// const addSummary = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { firstSummary, secondSummary } = req.body;

//         if (!firstSummary || !secondSummary) {
//             return res.status(400).json({ error: "Missing summaries" });
//         }

//         if (typeof secondSummary !== "object" || !secondSummary.matchWinner) {
//             return res.status(400).json({ message: "Missing Match Winner" });
//         }

//         const match = await Match.findById(id);
//         if (!match) {
//             return res.status(404).json({ error: "Invalid match ID" });
//         }

//         match.firstSummary = firstSummary;
//         match.secondSummary = secondSummary;

//         await match.save();

//         res.status(200).json({ message: "Successfully saved", match });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// };


const fetchSummary = async(req, res)=>{
    try {
        const {id}= req.params
        const matchSummary = await Match.findById(id).select('firstSummary secondSummary')

        if(!matchSummary){
            res.status(500).json({message: 'Not summary'})
        }

        res.status(200).json({
            firstSummary: matchSummary.firstSummary,
            secondSummary: matchSummary.secondSummary,
        })


    } catch (error) {
        throw new ApiError(400,'something Went Wrong')
    }
}
export { createMatch , deleteMatch, getmatch, findMatch, addToss,fetchSummary, fetchFirstSummary, addFirstSummary, addSecondSummary, setMatchComplete};

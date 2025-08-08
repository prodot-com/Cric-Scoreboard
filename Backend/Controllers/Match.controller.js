import ApiError from '../Utils/ApiError.js'
import { Match } from '../model/Match.model.js';

const createMatch = async (req, res) => {
    try {
        const { name, team1, team2, over } = req.body; // ← FIXED
        console.log(name, team1, team2, over)

        if (!name || !team1 || !team2 || !over) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const match = await Match.create({ name, team1, team2, over });

        res.status(201).json(match);
        
        console.log("Created Match ID:", match._id);
        // res.send('Complete')
    } catch (error) {
        throw new ApiError(500, 'Something Went Wrong')
    }
};


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

const addSummary = async(req, res)=>{
    try {
        const {id} = req.params
        const {firstSummary, secondSummary} = req.body

        if(!firstSummary|| !secondSummary){
            return res.status(400).json({ error: 'Missing summaries' })
        }

        const match =await Match.findById(id)
        if(!match){
            return res.status(400).json({error: 'invalid id'})
        }

        match.firstSummary = firstSummary,
        match.secondSummary = secondSummary

        await match.save()

        res.status(200).json({message:'succesfully saved', match})

    } catch (error) {
        throw new ApiError(400, "Something Went Wrong")
    }
}

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
export { createMatch , deleteMatch, getmatch, findMatch, addToss, addSummary, fetchSummary};

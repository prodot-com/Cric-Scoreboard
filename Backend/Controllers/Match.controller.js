import ApiError from '../Utils/ApiError.js'
import { Match } from '../model/Match.model.js';

const createMatch = async (req, res, next) => {
    try {
        const { name, team1, team2, over } = req.body; // ← FIXED
        console.log(name, team1, team2, over)

        if (!name || !team1 || !team2 || !over) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const match = await Match.create({ name, team1, team2, over });

        res.status(201).json(match);
        // res.send('Complete')
    } catch (error) {
        console.error('Error creating match:', error);
        next(new ApiError(500, 'Something Went Wrong'));
    }
};

export { createMatch };

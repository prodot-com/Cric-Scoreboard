import express from 'express'
import ApiError from '../Utils/ApiError.js'


const createMatch = async()=>{
    try {
        const {creator, team1, team2} = req.body
        console.log(creator, team1, team2)
    } catch (error) {
        throw new ApiError(500, 'Something Went Wrong')
    }
}

export {createMatch}
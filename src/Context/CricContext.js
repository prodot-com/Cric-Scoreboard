import { createContext, useContext } from "react";

export const CricContext = createContext({

    matchDetails: [{
        name: 'pronay',
        team1: 'A',
        team1: 'B',
        over: 2
    }],
    addMatchDetails: () =>{}
})


export const useCric = ()=>{
    return useContext(CricContext)
} 


export const CricProvider = CricContext.Provider
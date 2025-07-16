import { createContext, useContext } from "react";

export const CricContext = createContext({

    matchDetails: {
    },
    addMatchDetails: () =>{}
})


export const useCric = ()=>{
    return useContext(CricContext)
} 


export const CricProvider = CricContext.Provider
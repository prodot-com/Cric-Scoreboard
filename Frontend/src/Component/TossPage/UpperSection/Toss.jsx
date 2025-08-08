import React, { useEffect, useState } from 'react'
import Title from '../../Title/Title'
import { useNavigate } from 'react-router'
import { useCric } from '../../../Context/CricContext'
import axios from 'axios'
import { useParams } from 'react-router'

const Toss = () => {
  
    const {id}=useParams()


  const [tossWinner,setTossWinner] = useState('Game')
  const [disable, setDisable] = useState(true)
  const [decision, setDecision] = useState('')

 
    let navigate = useNavigate()
    const routeChange = ()=>{
      // console.log(matchDetails.input)
      const local = JSON.parse(localStorage.getItem('matchDetails'))
      // console.log(local)
      navigate(`/admin/${id}`)
  }

  const getElement = ()=>{
    const local = JSON.parse(localStorage.getItem('matchDetails'))
    console.log(local)
    return [local?.team1, local?.team2]
  }

  const randomPick=(str1, str2)=> {
  return Math.random() < 0.5 ? str1 : str2;
  }

  const toss = ()=>{
    const [team1, team2 ] = getElement()
    const tossWinner = randomPick(team1, team2)
    console.log(tossWinner)
    setTossWinner(tossWinner)
    setDisable(false)
    return tossWinner
  }

  const handleDecision = async (choice)=>{
    const tossDetails ={
      tossWinner,
      decision: choice
    }
    try {
      const res = await axios.post(`https://cric-scoreboard.onrender.com/user/addtoss/${id}`,
      {
        tossWinner,
        decision: choice
      }
      )
      console.log('Toss Data:::',res.data)
    } catch (error) {
      console.log('Something Went Wrong')
      return
    }
      localStorage.setItem('tossDetails', JSON.stringify(tossDetails))
      setDecision(choice)
      console.log(tossDetails)
  }



    const changehandaler = ()=>{}


  return (
    <div className="min-h-screen w-full relative">
  {/* Radial Gradient Background from Bottom */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
    }}
  />
     <div className='relative z-10 font-mono'>
      <div className='flex justify-around'>
        {/* <Title text="TOSS" className="text-blue-800 text-5xl font-bold mt-0 pt-7 cursor-pointer" onClick={toss}/> */}
        <button onClick={toss} className='text-blue-800 text-5xl font-bold mt-0 pt-7 cursor-pointer'>
          Toss
        </button>
        <input type="text" className='bg-amber-400 mt-7 rounded-xl text-center' value={tossWinner} onChange={changehandaler}/>
      </div>
      <div className='flex justify-around mt-7'>
            <button className={disable?' text-4xl text-gray-400 bg-blue-300 rounded-xl p-1'
              :'font-bold text-4xl bg-blue-700 rounded-xl p-1'}  onClick={()=> handleDecision("BAT")}>BAT</button>
            
            <button className={disable?' text-4xl text-gray-400 bg-blue-300 rounded-xl p-1'
              :'font-bold text-4xl bg-blue-700 rounded-xl p-1'}  onClick={()=> handleDecision("BOWL")}>BOWL</button>
      </div>
      <button className='mt-9 bg-blue-600 p-3 rounded-xl text-center 
      font-bold cursor-pointer ml-55' onClick={routeChange}>Done</button>
    </div>
</div>

  )
}

export default Toss

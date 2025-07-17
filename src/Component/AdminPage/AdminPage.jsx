import React, { useState } from 'react'

const AdminPage = () => {

  const [battingteam, setBattingTeam] = useState('Team')
  const [currentRun, setCurrentRun] = useState(0)
  const [currentWicket, setCurrentWicket] = useState(0)


  const changeRun = ()=>{
    
  }

  return (
    <div>
      <div className='text-3xl font-bold flex justify-around mt-7'>
          <div>{battingteam}</div>
          <div>{`${currentRun}/${currentWicket}`}</div>
      </div>

        <div className='flex justify-around mt-15 '>
          {[0,1,2,3,4,5,6,"wide","no"].map((value)=>(
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10' onClick={changeRun(value)}>{value}</button>
          ))}
        </div>
        {/* <div className='flex justify-around mt-7 '>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>Wide</button>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>No Ball</button>
        </div>
        <div className='flex justify-around mt-15 '>
            <button className='bg-red-600 p-1 rounded-xl h-14 w-14'>OUT</button>
        </div> */}
    </div>
  )
}



export default AdminPage

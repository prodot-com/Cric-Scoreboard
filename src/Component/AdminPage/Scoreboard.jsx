import React from 'react'
import Title from '../Title/Title'

const Scoreboard = () => {
  return (
    <div>
      <div className='flex justify-around'>
        <Title text='Team-1'/>
        <div className='font-bold text-2xl'>{`Runs: 100/2`}</div>
      </div>
    </div>
  )
}

export default Scoreboard

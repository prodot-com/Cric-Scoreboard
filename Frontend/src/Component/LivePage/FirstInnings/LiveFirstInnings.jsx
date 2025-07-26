import React from 'react'
import {io} from 'socket.io-client'

const LiveFirstInnings = () => {
  return (
    <div>
      <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>Live 1st Innings</h3>
      <h4 className='flex justify-center text-2xl font-bold mt-12 text-indigo-700'>{`Data: `}</h4>
    </div>
  )
}

export default LiveFirstInnings

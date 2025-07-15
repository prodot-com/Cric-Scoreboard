import React from 'react'

const ScoreChanger = () => {
  return (
    <div>
        <div className='flex justify-around mt-15 '>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>1</button>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>2</button>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>3</button>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>4</button>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>5</button>
            <button className='bg-amber-400 p-1 rounded-xl h-10 w-10'>6</button>
        </div>
        <div className='flex justify-around mt-7 '>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>Wide</button>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>No Ball</button>
        </div>
        <div className='flex justify-around mt-15 '>
            <button className='bg-red-600 p-1 rounded-xl h-14 w-14'>OUT</button>
        </div>
    </div>
  )
}

export default ScoreChanger

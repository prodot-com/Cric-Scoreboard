import React from 'react'
import Title from '../../Title/Title'

const Toss = () => {
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
        <Title text="TOSS" className="text-blue-800 text-5xl font-bold mt-0 pt-7"/>
        <input type="text" className='bg-amber-400 mt-7 rounded-xl text-center' value='A' />
      </div>
      <div className='flex justify-around mt-7'>
            <button className='font-bold text-4xl bg-blue-700 rounded-xl p-1'>BAT</button>
            <button className='font-bold text-4xl bg-blue-700 rounded-xl p-1'>BOWL</button>
      </div>
      <button className='mt-9 bg-blue-600 p-3 rounded-xl text-center font-bold'>Done</button>
    </div>
</div>

  )
}

export default Toss

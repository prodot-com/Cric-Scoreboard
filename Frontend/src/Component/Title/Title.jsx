import React from 'react'

const Title = ({text, className=''}) => {
  return (
    <div className={`flex justify-center items-center text-2xl font-bold mt-5  ${className}`}>
      <h3>{text}</h3>
    </div>
  )
}

export default Title

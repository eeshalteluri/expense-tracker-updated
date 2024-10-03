import React, { useState } from 'react'
import { CiCircleChevDown, CiCircleChevUp  } from "react-icons/ci";


const Accordion = ({title, description, currency}) => {
    const [isActive, setActive] = useState(false)
    
    const toggleIsActive = () => {
        setActive(!isActive)
    }
  return (
    <>
    <div className='xs:flex xs:justify-between xs:items-center'>
        <div>
            <button type='button' onClick={toggleIsActive} className='w-full text-2xl font-semibold text-left flex justify-between items-center '>{title} {isActive ? <CiCircleChevUp className='xs:hidden'/> : <CiCircleChevDown className='xs:hidden'/>}</button>
        </div>
        <div className={isActive ? '' : 'hidden xs:block '}>
          <span className='font-semibold text-lg'>{description} </span>
          <span className=''>{currency}</span>
        </div>
    </div>
    </>
  )
}

export default Accordion

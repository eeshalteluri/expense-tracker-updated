import React, {useState} from 'react'
import SearchBar from '../components/SearchBar'
import { CiCircleChevDown, CiCircleChevUp  } from "react-icons/ci";
import PersonalExpenseCard from '../components/PersonalExpenseCard'


const PersonalExpenses = () => {
  const [isActive, setActive] = useState(false)
    
    const toggleIsActive = () => {
        setActive(!isActive)
    }

  return (
    <div className='w-full max-h-[440px] md:max-h-[730px] overflow-y-auto section-margin-y border-[1px] border-black rounded flex flex-col justify-start items-center bg-primary'>
      <button type="button" onClick={toggleIsActive} className='w-full
      padding-x padding-y flex justify-between items-center'>
      <h2 className='text-left text-2xl font-semibold'>Personal Expenses</h2>
      {isActive ? <CiCircleChevDown className='w-[24px] h-[24px] '/> : <CiCircleChevUp className='w-[24px] h-[24px]'/>}
      </button>

      <div className={isActive ? 'hidden' : '' }>
      <SearchBar />
      <div className='padding-y grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-col-5'>
      
    </div>
    </div>
    </div>
  )
}

export default PersonalExpenses

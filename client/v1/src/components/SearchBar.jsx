import React from 'react'
import { CiSearch } from "react-icons/ci";


const SearchBar = () => {
  return (
      <div className=' padding-x'>
      <input type='text' placeholder='search' className='w-full pl-3 md:pl-6 padding-y bg-secondary rounded-full border-[1px] border-black'/>
      </div>

  )
}

export default SearchBar

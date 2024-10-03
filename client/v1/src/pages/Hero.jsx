import React from 'react'
import { Link } from 'react-router-dom'
import walletLogo from '../assets/wallet.png'

const Hero = () => {
  return (
    <>
      <div className='py-4 padding-x cursor-pointer font-semibold flex items-center shadow-lg bg-slate-50'>
        <img src={walletLogo} alt="logo" className='w-[24px]'/>
        <h3 className='ml-1 block'>Deadpocket</h3>
      </div>

      <div className='flex h-[90vh] margin-x my-auto text-center'>
        <div className='m-auto'>
      <h1 className='font-bold text-4xl xs:text-6xl align-middle'>Track you Personal Expenses</h1> 

      <div className='margin-y '>
      
      <Link to='/v1/signup'>
      <button type='submit' className='p-2 rounded text-black  mr-2 w-24 bg-secondary hover:bg-[#a3ccf7] active:bg-secondary shadow-xl'>Sign Up</button> 
      </Link>

      <Link to='/v1/login'>
      <button type='submit' className='p-2 rounded text-black  mr-2 w-24 bg-secondary hover:bg-[#a3ccf7] active:bg-secondary shadow-xl'>Log In</button>
      </Link>
      </div>
      </div>
      </div>
    </>
  )
}

export default Hero

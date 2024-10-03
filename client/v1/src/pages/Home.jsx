import Modal from 'react-modal'
import React, { useState, useEffect } from 'react'
import TotalExpenses from '../Containers/TotalExpenses'
import AddPersonalExpense from '../components/AddPersonalExpense'
import PersonalExpenseCard from '../components/PersonalExpenseCard'

import { FiPlus } from "react-icons/fi";
import axios from 'axios'
import { BACKEND_URL } from '../config'
import getCookie from '../../../../server/v1/middlewares/getCookie'

import SearchBar from '../components/SearchBar'
import { CiCircleChevDown, CiCircleChevUp  } from "react-icons/ci";
import Navbar from '../Containers/Navbar'


const Home = () => {
  const [userData, setUserData] = useState({})
  const [personalExpenses, setpersonalExpenses] = useState([])
  const [error, setError] = useState(null)

  const userDataHandler = async (userData) => {
    setUserData(userData)
  }
  
  const personalExpensesHandler = async (expenses) => {
    setpersonalExpenses(expenses)
  }

  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const [isActive, setActive] = useState(false)
    
  const toggleIsActive = () => {
        setActive(!isActive)
  }

  const totalPersonalExpensesHandler = (personalExpenses) =>{
    let totalAmount = 0;
    personalExpenses.map((expense)=> {
      totalAmount+=Number(expense.expAmount)
    })
    console.log(totalAmount)
    return totalAmount;
  }

  const setErrorHandler = (error) => {
    setError(error)
  }

  const totalPersonalExpensesAmount = totalPersonalExpensesHandler(personalExpenses)

  const fetchData = async () => {
    try{

     console.log("fetching data...")
     const token = await getCookie('SessionID');
     const response = await axios.get(`${BACKEND_URL}/api/v1/auth/home`,{
       headers: {
         Authorization: `Bearer ${token}`
       }
     })

     userDataHandler(response.data)
     console.log(response.data)
     console.log(response.data.personalExpenses)
     personalExpensesHandler(response.data.personalExpenses)
     console.log(personalExpenses)

    }catch(error){
     console.log(error.response.data.message)
     setErrorHandler(error.response.data.message)
    }
 }

 useEffect(() => {
  fetchData()
 },[])


  
  return (
    <>
    <Navbar />
    
    <div className=' full-width padding-x padding-y m-[auto] '>
      
    {error && <p className='text-red-500 mt-2'>{error}</p>}
      {!error && <h3 className='text-xl mt-6'>Welcome <span className='font-semibold'>{userData && userData.firstName }!!</span></h3>}
      <TotalExpenses 
      personalExpenses={totalPersonalExpensesAmount}
      currency={userData.currency}/>
      
      <div className='overflow-x-hidden shadow-lg  bg-slate-50 w-full overflow-y-auto section-margin-y border-[1px]  rounded flex flex-col justify-start items-center'>
      <button type="button" onClick={toggleIsActive} className='w-full
      padding-x padding-y flex justify-between items-center'>
      <h2 className='text-left text-2xl font-semibold'>Personal Expenses</h2>
      </button>
      
      <div className='padding-y grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-col-5 auto-rows-auto'>
    {personalExpenses && 
    personalExpenses.map((expense)=> (
      <PersonalExpenseCard
      key={expense._id} 
      id={expense._id}
      currency={userData.currency}
      expName={expense.expName}
      expAmount={expense.expAmount}
      expDate={expense.expDate}
      expDescription={expense.expDescription}
      fetchData={fetchData} 
      
      className='onhover-focus'/>))}
    </div>
    </div>

      <button className='padding-x z-5 absolute bottom-10 right-0 flex justify-center items-center' onClick={openModal}>
      <FiPlus className='bg-secondary w-[48px] h-[48px] rounded p-3'/>
    </button>   

    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={
        {
          overlay: {
            background: 'rgba(0,0,0,0.20)'
        }
      }
    }
      className='w-[90vw] xs:max-w-[450px] mx-[auto] mt-40 p-4 '
      >
        <AddPersonalExpense fetchData={fetchData} closeModal={closeModal}/>
      </Modal>
    </div>
    </>
  )
}

export default Home
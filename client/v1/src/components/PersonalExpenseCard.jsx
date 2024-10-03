import React,{useState} from 'react'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Modal from 'react-modal';
import UpdatePersonalExpense from './UpdatePersonalExpense';

import { CiCircleChevDown, CiCircleChevUp  } from "react-icons/ci";
import { BACKEND_URL } from '../config';

import axios from 'axios';
import getCookie from '../../../../server/v1/middlewares/getCookie';

const PersonalExpenseCard = ({id, currency, expName, expAmount, expDate, expDescription, fetchData}) => {
  
  const expenseData = {id, currency, expName, expAmount, expDate, expDescription, fetchData}

  const [isActive, setActive] = useState(true)
    
    let toggleIsActive = () => {
        setActive(!isActive)
    }

    const [isModalOpen, setModalOpen] = useState(false)
    
    const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

    

    const deleteExpense = async () => {
      const token = await getCookie('SessionID');
      console.log("CardToken: ", token)
      const response = await axios.delete(`${BACKEND_URL}/api/v1/auth/home`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {id},
       withCredentials: true})

      fetchData()
      console.log("Data fetched successfully!!")
      console.log("Expense deleted successfully!!")
    }

    console.log("expense_id: ", id)
  
    return (
    <div className='h-fit w-[75vw] xs:w-[300px] border-[1px] bg-[#DFEDFC] overflow-y-auto rounded m-2 p-2 shadow-lg flex flex-col justify-between transition-all duration-300'>

      <div onClick={toggleIsActive} className=' w-full flex flex-row justify-between items-start text-xl font-semibold '>

      <h3 className={`w-[120px] ${isActive ? 'truncate': 'wrap'}`}>{expName}</h3>

      <div className='flex flex-row justify-between items-center text-xl font-semibold'>
      <p className='text-center '>{expAmount} {currency}</p>
      {isActive ? <CiCircleChevDown className='w-[24px] h-[24px] ml-1'/> : <CiCircleChevUp className='w-[24px] h-[24px] ml-1'/>}
      </div>

      </div>
      
      <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isActive ? 'max-h-0' : 'max-h-[500px]'}`}>
        <div>
      <p className='text-md font-normal'>{expDate}</p>
      <p className='text-lg line-clamp-2 hover:line-clamp-none'>{expDescription}</p>
      </div>

    <div className='w-full flex justify-between'>
        <button onClick={openModal} className='w-[49.5%] flex  justify-center items-center bg-secondary border-[1px] rounded p-1 active:bg-secondary hover:bg-white text-white hover:text-gray-800'> 
            <MdEdit className='w-[32px] h-[32px]'/>
        </button>

        <button onClick={deleteExpense} className='w-[49.5%] flex justify-center items-center bg-secondary border-[1px] rounded p-1 active:bg-secondary hover:bg-white text-white hover:text-gray-800'>
            <MdDelete className='w-[30px] h-[30px]'/>
        </button>
    </div>
    </div>

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
        <UpdatePersonalExpense id={id} fetchData={fetchData} fetchExpense={expenseData} closeModal={closeModal}/>
      </Modal>

    </div>
  )
}

export default PersonalExpenseCard

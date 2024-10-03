import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { expenseSchema } from '../../../../common/index.js'
import { BACKEND_URL } from '../config'
import axios from 'axios'
import { AiOutlineClose } from "react-icons/ai";
import getCookie from '../../../../server/v1/middlewares/getCookie.js'


const AddPersonalExpense = ({fetchData, addExpense, closeModal}) => {
  
  const navigate = useNavigate()
  const [newExpenseDetails, setNewExpenseDetails] = useState(
    {
      expName: '',
      expAmount: '',
      expDate: '',
      expDescription: '',

    }
  )


  const newExpensehandler = (e) => {
    setNewExpenseDetails({
      ...newExpenseDetails, [e.target.name]: e.target.value
    })
  }

  const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({resolver: zodResolver(expenseSchema)})

const onSubmit = async (data) =>{
  try {
          const token = await getCookie('SessionID');
          console.log('token:', token)
          const response = await axios.post(`${BACKEND_URL}/api/v1/auth/home`, newExpenseDetails, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          closeModal()
          fetchData()
} catch(error) {
  console.log(error)
  setError("root", {
    message: error.message,
  })
}

addExpense(newExpenseDetails)

closeModal()
}


  return (
    <div className='bg-primary flex flex-col padding-x padding-y rounded-lg py-4'>
        <button onClick={closeModal} className='flex justify-end'>
            <AiOutlineClose />
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label  className='flex flex-col m-1'>
            What did you spend on?
            <input {...register("expName")} type="text" className='p-1' onChange={newExpensehandler}/>
          </label>
          {errors.expName && <p className='text-red-400'>{errors.expName.message}</p>}
          <label  className='flex flex-col  m-1'>
            How much?
            <input {...register("expAmount")} type="number"  className='p-1' onChange={newExpensehandler}/>
          </label>
          {errors.expAmount && <p className='text-red-400'>{errors.expAmount.message}</p>}
          <label  className='flex flex-col  m-1'>When did you spend?
            <input {...register("expDate")} type="date"  className='p-1' onChange={newExpensehandler}/>
          </label>
          {errors.expDate && <p className='text-red-400'>{errors.expDate.message}</p>}
          <label  className='flex flex-col  m-1'>Add any notes:
            <textarea {...register("expDescription")} rows={4}  onChange={newExpensehandler}/>
          </label>
          {errors.expDescription && <p className='text-red-400'>{errors.expDescription.message}</p>}
          {errors.root && <p className='text-red-400'>{errors.root.message}</p>}
          <button disabled={isSubmitting} type='submit' className='w-full bg-secondary hover:border-2 active:bg-[#B3E2A7] rounded mt-4'>{isSubmitting ? 'Adding Expense...': 'Add Expense'}</button>
      </form>
    </div>
  )
}

export default AddPersonalExpense

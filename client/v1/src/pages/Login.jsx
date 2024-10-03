import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { loginSchema } from '../../../../common/index.js'
import { BACKEND_URL } from '../config'
import axios from 'axios'

import { FaRegEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {

  const navigate = useNavigate()
  const [ loginData, setLoginData ] = useState(
    {
      email: "",
      password:"",
    }
  )
  const handleLoginData = (e) => {
    setLoginData({...loginData, [e.target.name]: e.target.value})
  }

  const [isVisible, setIsVisible] = useState(false)

  const isVisibleHandler = () => {
    setIsVisible(!isVisible)
  }

  const { register, handleSubmit , setError, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(loginSchema)})

  const submitHandler = async () => {
    try{
      console.log("submit handler1")
    await axios.post(`${BACKEND_URL}/api/v1/auth/signin`,loginData, {withCredentials: true})
    console.log("submit handler2")
    navigate("/v1/auth/dashboard")
  }catch(error){
    console.log(error)
    setError("root", {
      message: error.response.data.message,
    })
    }
  }

  return (
      <div className='flex flex-col justify-center items-center p-4 min-w-[200px] max-w-[500px] mx-[16px] my-[250px] xs:mx-[auto] border-[1px] shadow-lg rounded-md bg-primary'>
      <h2 className='text-2xl font-semibold text-center'>Login</h2>

      <form onSubmit={handleSubmit(submitHandler)} className='[&>*]:mt-4 [&>*]:w-full [&>*]:p-[8px]  [&>*]:border-[1px]  [&>*]:rounded-md [&>p]:border-none [&>p]:m-0 [&>p]:p-0'>
      <input {...register("email")} onChange={handleLoginData} type="text" placeholder='Email' name='email'/>
      {errors.email && <p className='text-red-500 mt-2'>{errors.email.message}</p>}
      <div className='bg-white flex justify-between items-center'>
      <input {...register("password")} onChange={handleLoginData} type={ isVisible ? 'text': 'password' } name="password" placeholder='Password' className='focus:outline-none'/>
      {isVisible? <FaEyeSlash className='w-[20px] h-[20px]' onClick={isVisibleHandler}/> : <FaRegEye className='w-[20px] h-[20px]' onClick={isVisibleHandler}/>} 
      </div>
      {errors.password && <p className='text-red-500 mt-2'>{errors.password.message}</p>}
      <button type='submit' className='bg-secondary hover:bg-[#a3ccf7] active:bg-secondary'>Log In</button>
    </form>
    {errors.root && <p className='text-red-500 mt-2'>{errors.root.message}</p>}
    <p className='mt-2'>Don't have an account?
      <Link to='/v1/signup' className='underline ml-2'>Sign Up</Link>
    </p>
    </div>
  )
}

export default Login

//use nodemailer for verifying emails

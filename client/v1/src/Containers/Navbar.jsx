import React, {useState} from 'react'
import walletLogo from '../assets/wallet.png'
import { IoIosMenu } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import getCookie from '../../../../server/v1/middlewares/getCookie';


const Navbar = () => {

const [isActive, setActive] = useState(false)
    
let toggleIsActive = () => {
        setActive(!isActive)
}

const navigate = useNavigate()

const home = () => {
  navigate('/v1/auth/dashboard')
}

const logOut = async () => {
  console.log('Current cookies: ', document.cookie)
  const token = getCookie('SessionID')
  console.log('logout token: ', token)
  await axios.get(`${BACKEND_URL}/api/v1/auth/logout`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
})

console.log("logged out successfully!!")
navigate('/v1/login')
}

  return (
    <>
    <div className='h-[8vh] p-8 shadow-lg flex justify-between items-center'>
      <div onClick={home} className='cursor-pointer font-semibold flex items-center  bg-slate-50'>
        <img src={walletLogo} alt="logo" className='w-[24px]'/>
        <h3 className='ml-1 hidden xs:block'>Deadpocket</h3>
      </div>

      <div onClick={toggleIsActive} className='cursor-pointer transition-transform duration-300 ease-in-out'>
        { isActive ? 
        (
            <div>
            <MdOutlineClose className='w-[24px] h-[24px] transform rotate-90' />
    <div className='absolute w-[120px] p-2 right-8 shadow-lg rounded bg-primary'>
    <Link to='/v1/auth/dashboard/settings' >
    <div className='flex justify-around items-center'>
        <CiSettings className='w-[24px] h-[24px]'/>
        <p>Settings</p>
    </div>
    </Link>

    <div onClick={logOut} className='flex justify-around items-center mt-1'>
        <IoIosLogOut className='w-[24px] h-[24px]'/>
        <p>Logout</p>
    </div>
</div>
</div>
) : (<IoIosMenu className='w-[24px] h-[24px]'/>) }
        
      </div>
    </div>
    </>
  )
}

export default Navbar

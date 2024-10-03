import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../Containers/Navbar';
import { BACKEND_URL } from '../config';
import getCookie from '../../../../server/v1/middlewares/getCookie';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../../../common';
import { FaRegEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";

const Settings = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate()

  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) });

  const handleUserDetails = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const onSubmit = async (data) => {
    console.log('onSubmit called with data:', data);
    const token = await getCookie('SessionID');
    console.log('Retrieved token:', token);

    try {
      console.log('Submitting UserDetails:', userDetails);
      await axios.put(`${BACKEND_URL}/api/v1/auth/home/settings`, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Update request sent')

      navigate('/v1/login')
    } catch (error) {
      console.log('Error during update:', error);
      setError("root", {
        message: error.response.data.message,
      })
    }
  };

  const isVisibleHandler = () => {
    setIsVisible(!isVisible);
  };

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const token = await getCookie('SessionID');
      const response = await axios.get(`${BACKEND_URL}/api/v1/auth/home/settings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const fetchedData = response.data;
      console.log('Fetched data:', fetchedData);

      setUserDetails(fetchedData);

      for (const key in fetchedData) {
        setValue(key, fetchedData[key]);
      }

    } catch (error) {
      console.log('Error during data fetch:', error);
      console.log(error.response.data.message)
      setError("root", {
        message: error.response.data.message,
      })
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log('Form state:', { isSubmitting, errors });

  return (
    <div>
      <Navbar />

      {errors.root && <p className='padding-x margin-x text-red-500 mt-2'>{errors.root.message}</p>}

      <div className='bg-primary w-fit padding-x padding-y mx-auto margin-y rounded '>
        <p><span className='font-semibold'>NOTE: </span> Update the fields, and verify with your password.</p>
      </div>

      <div className='bg-primary w-fit padding-x padding-y mx-auto margin-y rounded'>
        <p><span className='font-semibold'>NOTE: </span> Trying to change password? Cannot do it for now :(</p>
      </div>

      <div className='margin-x margin-y flex flex-col justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-[250px] [&>*]:mt-4 [&>*]:w-full [&>*]:p-[8px]  [&>*]:border-[1px]  [&>*]:border-black  [&>*]:rounded-md [&>p]:border-none [&>p]:m-0 [&>p]:p-0'>
          <input {...register("firstName")} onChange={handleUserDetails} name="firstName" type="text" placeholder='First Name' />
          {errors.firstName && <p className='text-red-500 mt-2'>{errors.firstName.message}</p>}
          
          <input {...register("lastName")} onChange={handleUserDetails} name="lastName" type="text" placeholder='Last Name' />
          {errors.lastName && <p className='text-red-500 mt-2'>{errors.lastName.message}</p>}
          
          <input {...register("userName")} onChange={handleUserDetails} name="userName" type="text" placeholder='Username' />
          {errors.userName && <p className='text-red-500 mt-2'>{errors.userName.message}</p>}
          
          <input {...register("email")} onChange={handleUserDetails} name="email" type="email" placeholder='Email'/>
          {errors.email && <p className='text-red-500 mt-2'>{errors.email.message}</p>}
          
          <div className='overflow-y-hidden bg-white'>
        <select {...register("currency")} name="currency" value={userDetails.currency} onFocus={(e) => { e.target.size = 5}}
    onBlur={(e) => { e.target.size = 1; }} onChange={handleUserDetails} className='w-full'>
      <option selected value="USD" label="US dollar">USD</option>
      <option value="CNY" label="Chinese yuan">CNY</option>
      <option value="EUR" label="Euro">EUR</option>
      <option value="JPY" label="Japanese yen">JPY</option>
      <option value="INR" label="Indian rupee">INR</option>
      <option value="GBP" label="Pound sterling">GBP</option>
      <option disabled>──────────</option>
      <option value="AFN" label="Afghan afghani">AFN</option>
      <option value="ALL" label="Albanian lek">ALL</option>
      <option value="AMD" label="Armenian dram">AMD</option>
      <option value="DZD" label="Algerian dinar">DZD</option>
      <option value="AOA" label="Angolan kwanza">AOA</option>
      <option value="ARS" label="Argentine peso">ARS</option>
      <option value="AUD" label="Australian dollar">AUD</option>
      <option value="AWG" label="Aruban florin">AWG</option>
      <option value="AZN" label="Azerbaijani manat">AZN</option>
      <option value="GBP" label="British pound">GBP</option>
      <option value="BAM" label="Bosnia and Herzegovina convertible mark">BAM</option>
      <option value="BBD" label="Barbadian dollar">BBD</option>
      <option value="BDT" label="Bangladeshi taka">BDT</option>
      <option value="BGN" label="Bulgarian lev">BGN</option>
      <option value="BHD" label="Bahraini dinar">BHD</option>
      <option value="BIF" label="Burundian franc">BIF</option>
      <option value="BMD" label="Bermudian dollar">BMD</option>
      <option value="BND" label="Brunei dollar">BND</option>
      <option value="BOB" label="Bolivian boliviano">BOB</option>
      <option value="BRL" label="Brazilian real">BRL</option>
      <option value="BSD" label="Bahamian dollar">BSD</option>
      <option value="BTN" label="Bhutanese ngultrum">BTN</option>
      <option value="BWP" label="Botswana pula">BWP</option>
      <option value="BYN" label="Belarusian ruble">BYN</option>
      <option value="BZD" label="Belize dollar">BZD</option>
      <option value="MMK" label="Burmese kyat">MMK</option>
      <option value="CAD" label="Canadian dollar">CAD</option>
      <option value="CDF" label="Congolese franc">CDF</option>
      <option value="XPF" label="CFP franc">XPF</option>
      <option value="CLP" label="Chilean peso">CLP</option>
      <option value="COP" label="Colombian peso">COP</option>
      <option value="CRC" label="Costa Rican colón">CRC</option>
      <option value="CUC" label="Cuban convertible peso">CUC</option>
      <option value="CUP" label="Cuban peso">CUP</option>
      <option value="CVE" label="Cape Verdean escudo">CVE</option>
      <option value="CZK" label="Czech koruna">CZK</option>
      <option value="HRK" label="Croatian kuna">HRK</option>
      <option value="XAF" label="Central African CFA franc">XAF</option>
      <option value="KHR" label="Cambodian riel">KHR</option>
      <option value="KYD" label="Cayman Islands dollar">KYD</option>
      <option value="KMF" label="Comorian franc">KMF</option>
      <option value="DJF" label="Djiboutian franc">DJF</option>
      <option value="DKK" label="Danish krone">DKK</option>
      <option value="DOP" label="Dominican peso">DOP</option>
      <option value="XCD" label="Eastern Caribbean dollar">XCD</option>
      <option value="EGP" label="Egyptian pound">EGP</option>
      <option value="ERN" label="Eritrean nakfa">ERN</option>
      <option value="ETB" label="Ethiopian birr">ETB</option>
      <option value="FJD" label="Fijian dollar">FJD</option>
      <option value="FKP" label="Falkland Islands pound">FKP</option>
      <option value="GEL" label="Georgian lari">GEL</option>
      <option value="GGP" label="Guernsey pound">GGP</option>
      <option value="GHS" label="Ghanaian cedi">GHS</option>
      <option value="GIP" label="Gibraltar pound">GIP</option>
      <option value="GMD" label="Gambian dalasi">GMD</option>
      <option value="GNF" label="Guinean franc">GNF</option>
      <option value="GTQ" label="Guatemalan quetzal">GTQ</option>
      <option value="GYD" label="Guyanese dollar">GYD</option>
      <option value="HKD" label="Hong Kong dollar">HKD</option>
      <option value="HNL" label="Honduran lempira">HNL</option>
      <option value="HTG" label="Haitian gourde">HTG</option>
      <option value="HUF" label="Hungarian forint">HUF</option>
      <option value="IDR" label="Indonesian rupiah">IDR</option>
      <option value="ILS" label="Israeli new shekel">ILS</option>
      <option value="IQD" label="Iraqi dinar">IQD</option>
      <option value="IRR" label="Iranian rial">IRR</option>
      <option value="ISK" label="Icelandic króna">ISK</option>
      <option value="JEP" label="Jersey pound">JEP</option>
      <option value="JMD" label="Jamaican dollar">JMD</option>
      <option value="JOD" label="Jordanian dinar">JOD</option>
      <option value="JPY" label="Japanese yen">JPY</option>
      <option value="KES" label="Kenyan shilling">KES</option>
      <option value="KGS" label="Kyrgyzstani som">KGS</option>
      <option value="KID" label="Kiribati dollar">KID</option>
      <option value="KWD" label="Kuwaiti dinar">KWD</option>
      <option value="KZT" label="Kazakhstani tenge">KZT</option>
      <option value="LAK" label="Lao kip">LAK</option>
      <option value="LBP" label="Lebanese pound">LBP</option>
      <option value="LRD" label="Liberian dollar">LRD</option>
      <option value="LSL" label="Lesotho loti">LSL</option>
      <option value="LYD" label="Libyan dinar">LYD</option>
      <option value="MAD" label="Moroccan dirham">MAD</option>
      <option value="MDL" label="Moldovan leu">MDL</option>
      <option value="MGA" label="Malagasy ariary">MGA</option>
      <option value="MKD" label="Macedonian denar">MKD</option>
      <option value="IMP" label="Manx pound">IMP</option>
      <option value="MNT" label="Mongolian tögrög">MNT</option>
      <option value="MOP" label="Macanese pataca">MOP</option>
      <option value="MRU" label="Mauritanian ouguiya">MRU</option>
      <option value="MUR" label="Mauritian rupee">MUR</option>
      <option value="MVR" label="Maldivian rufiyaa">MVR</option>
      <option value="MWK" label="Malawian kwacha">MWK</option>
      <option value="MXN" label="Mexican peso">MXN</option>
      <option value="MYR" label="Malaysian ringgit">MYR</option>
      <option value="MZN" label="Mozambican metical">MZN</option>
      <option value="KPW" label="North Korean won">KPW</option>
      <option value="TWD" label="New Taiwan dollar">TWD</option>
      <option value="NAD" label="Namibian dollar">NAD</option>
      <option value="ANG" label="Netherlands Antillean guilder">ANG</option>
      <option value="NGN" label="Nigerian naira">NGN</option>
      <option value="NIO" label="Nicaraguan córdoba">NIO</option>
      <option value="NOK" label="Norwegian krone">NOK</option>
      <option value="NPR" label="Nepalese rupee">NPR</option>
      <option value="NZD" label="New Zealand dollar">NZD</option>
      <option value="OMR" label="Omani rial">OMR</option>
      <option value="PAB" label="Panamanian balboa">PAB</option>
      <option value="PEN" label="Peruvian sol">PEN</option>
      <option value="PGK" label="Papua New Guinean kina">PGK</option>
      <option value="PHP" label="Philippine peso">PHP</option>
      <option value="PKR" label="Pakistani rupee">PKR</option>
      <option value="PLN" label="Polish złoty">PLN</option>
      <option value="PYG" label="Paraguayan guaraní">PYG</option>
      <option value="QAR" label="Qatari riyal">QAR</option>
      <option value="RON" label="Romanian leu">RON</option>
      <option value="RUB" label="Russian ruble">RUB</option>
      <option value="RWF" label="Rwandan franc">RWF</option>
      <option value="WST" label="Samoan tālā">WST</option>
      <option value="ZAR" label="South African rand">ZAR</option>
      <option value="LKR" label="Sri Lankan rupee">LKR</option>
      <option value="RSD" label="Serbian dinar">RSD</option>
      <option value="KRW" label="South Korean won">KRW</option>
      <option value="SAR" label="Saudi riyal">SAR</option>
      <option value="CHF" label="Swiss franc">CHF</option>
      <option value="SEK" label="Swedish krona">SEK</option>
      <option value="SGD" label="Singapore dollar">SGD</option>
      <option value="SHP" label="Saint Helena pound">SHP</option>
      <option value="SLL" label="Sierra Leonean leone">SLL</option>
      <option value="SLS" label="Somaliland shilling">SLS</option>
      <option value="SOS" label="Somali shilling">SOS</option>
      <option value="SRD" label="Surinamese dollar">SRD</option>
      <option value="SSP" label="South Sudanese pound">SSP</option>
      <option value="STN" label="São Tomé and Príncipe dobra">STN</option>
      <option value="SYP" label="Syrian pound">SYP</option>
      <option value="SZL" label="Swazi lilangeni">SZL</option>
      <option value="THB" label="Thai baht">THB</option>
      <option value="PRB" label="Transnistrian ruble">PRB</option>
      <option value="TJS" label="Tajikistani somoni">TJS</option>
      <option value="TMT" label="Turkmenistan manat">TMT</option>
      <option value="TND" label="Tunisian dinar">TND</option>
      <option value="TOP" label="Tongan paʻanga">TOP</option>
      <option value="TRY" label="Turkish lira">TRY</option>
      <option value="TTD" label="Trinidad and Tobago dollar">TTD</option>
      <option value="TVD" label="Tuvaluan dollar">TVD</option>
      <option value="TZS" label="Tanzanian shilling">TZS</option>
      <option value="UAH" label="Ukrainian hryvnia">UAH</option>
      <option value="UGX" label="Ugandan shilling">UGX</option>
      <option value="USD" label="United States dollar">USD</option>
      <option value="UYU" label="Uruguayan peso">UYU</option>
      <option value="UZS" label="Uzbekistani soʻm">UZS</option>
      <option value="AED" label="United Arab Emirates dirham">AED</option>
      <option value="VES" label="Venezuelan bolívar soberano">VES</option>
      <option value="VND" label="Vietnamese đồng">VND</option>
      <option value="VUV" label="Vanuatu vatu">VUV</option>
      <option value="XOF" label="West African CFA franc">XOF</option>
      <option value="ZMW" label="Zambian kwacha">ZMW</option>
      <option value="ZWB" label="Zimbabwean bonds">ZWB</option>
        </select>
        </div >
          {errors.currency && <p className='text-red-500 mt-2'>{errors.currency.message}</p>}
          
          <div className='bg-white flex justify-between items-center'>
            <input {...register("password")} onChange={handleUserDetails} type={isVisible ? 'text' : 'password'} name="password" placeholder='Password' className='focus:outline-none'/> 
            {isVisible ? <FaEyeSlash className='w-[20px] h-[20px]' onClick={isVisibleHandler}/> : <FaRegEye className='w-[20px] h-[20px]' onClick={isVisibleHandler}/>}
          </div>
          {errors.password && <p className='text-red-500 mt-2'>{errors.password.message}</p>}

          <div className='bg-white flex justify-between items-center'>
        <input {...register("confirmPassword")} onChange={handleUserDetails}  name='confirmPassword' type='password' placeholder='Confirm Password' className='focus:outline-none'/>
        </div>
        {errors.confirmPassword && <p className='text-red-500 mt-2'>{errors.confirmPassword.message}</p>}

        <button disabled={isSubmitting} type='submit' className='bg-secondary hover:bg-[#B3E2A7] active:bg-secondary'>{isSubmitting ? "Updating..." : "Update" }</button>
        </form>                                               
      </div>
    </div>
  );
};

export default Settings;

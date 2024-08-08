"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { EyeIcon } from '../../../public/logo'

const Register = () => {
    const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false)
  return (
    <div className='h-screen overflow-hidden bg-[#FAFAFC]'>
            <div className="flex flex-col items-center text-black justify-center h-2/3">
                <div className='flex flex-col items-center md:w-1/4 md:shadow-2xl border-[#fff] md:rounded-2xl'>
                <span className='font-bold text-[27px] md:mt-8'>Lets Register Account</span>
                <span className='text-black mb-5'>Hello user , you have
                a greatful journey</span>
                <input className='border m-3 border-[#8E8383] rounded-lg w-11/12 p-3' type="text" placeholder='Name' />
                <input className='border m-3 border-[#8E8383] rounded-lg w-11/12 p-3' type="text" placeholder='Lastname' />
                <input className='border m-3 border-[#8E8383] rounded-lg w-11/12 p-3' type="tel" placeholder='Phone' />
                <input className='border m-3 border-[#8E8383] rounded-lg w-11/12 p-3' type="text" placeholder='Email' />
                <div className='w-11/12 m-3 relative'>
                    <input className='p-3 w-full border border-[#8E8383] rounded-lg' type={isPasswordOpen ? "text" : "password"} placeholder='Password' />
                    <button className='absolute right-4 top-4' onClick={() => setIsPasswordOpen(!isPasswordOpen)}><EyeIcon /></button>
                </div>
                <button className='bg-[#4A3AFF] w-11/12 p-3 rounded-lg text-white font-semibold'>Sign Up</button>
                <div className='m-8'>
                    Already  have an account ?
                    <Link href="/login" className='font-bold'> Login</Link>
                </div>
                </div>
            </div>
        </div>
  )
}

export default Register
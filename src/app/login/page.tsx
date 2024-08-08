'use client';
import React, { useState } from 'react'
import { EyeIcon } from '../../../public/logo'
import Link from 'next/link';

const Page = () => {
    const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false)
    return (
        <div className='h-screen bg-[#FAFAFC]'>
            <div className="flex flex-col items-center text-black justify-center h-2/3">
                <div className='flex flex-col items-center md:w-1/4 md:shadow-2xl border-[#fff] md:rounded-2xl'>
                <span className='font-bold text-[27px] md:mt-8'>Lets Sign you in</span>
                <span className='text-black mb-5'>Welcome</span>
                <input className='border m-3 border-[#8E8383] rounded-lg w-3/4 md:w-5/6 p-3' type="text" placeholder='Email' />
                <div className='w-3/4 md:w-5/6 m-3 relative'>
                    <input className='p-3 w-full border border-[#8E8383] rounded-lg' type={isPasswordOpen ? "text" : "password"} placeholder='Password' />
                    <button className='absolute right-4 top-4' onClick={() => setIsPasswordOpen(!isPasswordOpen)}><EyeIcon /></button>
                </div>
                <div className='flex w-2/3 justify-end m-3 md:w-3/4'><span className='font-semibold '>Forgot Password ?</span></div>
                <button className='bg-[#4A3AFF] w-3/4 md:w-5/6 p-3 rounded-lg text-white font-semibold'>Sign in</button>
                <div className='m-8'>
                    Don't have an account ?
                    <Link href="/register" className='font-bold'> Register Now</Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Page
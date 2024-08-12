'use client';
import React, { useState } from 'react'
import { EyeIcon } from '../../../../public/logo'
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
type loginObject = {
    email: string,
    password: string
}
const Page = () => {
    const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false)
    const { register, handleSubmit } = useForm<loginObject>({ shouldUseNativeValidation: true });
    const onSubmit: SubmitHandler<loginObject> = async (data) => {
        signInWithEmailAndPassword(auth, data.email, data.password)
        signIn("credentials", {email:data.email,password:data.password, redirect: true, callbackUrl: "/mainpage"})
    }
    return (
        <div className='h-screen bg-[#FAFAFC]'>
            <div className="flex flex-col items-center text-black justify-center h-2/3">
                <div className='flex flex-col items-center md:w-1/4 md:shadow-2xl border-[#fff] md:rounded-2xl'>
                <span className='font-bold text-[27px] md:mt-8'>Lets Sign you in</span>
                <span className='text-black mb-5'>Welcome</span>
                <input className='border m-3 border-[#8E8383] rounded-lg w-3/4 md:w-5/6 p-3' autoComplete='email' type="text" placeholder='Email' {...register("email", {
                            required: "Please Enter Your Email.", pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}/>
                <form className='w-3/4 md:w-5/6 m-3 relative' onSubmit={handleSubmit(onSubmit)}>
                    <input className='p-3 w-full border border-[#8E8383] rounded-lg' {...register("password", {
                            required: "Please Enter Your Last Name.", minLength:3, maxLength:20, 
                        })} type={isPasswordOpen ? "text" : "password"} placeholder='Password' required autoComplete='new-password'/>
                    <button className='absolute right-4 top-4' onClick={() => setIsPasswordOpen(!isPasswordOpen)}><EyeIcon /></button>
                <div className='flex w-full justify-end my-3'><span className='font-semibold '>Forgot Password ?</span></div>
                    <input type='submit' className='bg-[#4A3AFF] w-full p-3 rounded-lg text-white font-semibold' value={"Login"}/>
                <div className='m-8'>
                    Don't have an account ?
                    <Link href="/register" className='font-bold'> Register Now</Link>
                </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Page
"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { EyeIcon } from '../../../../public/logo'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { ref, set } from 'firebase/database'
import { signIn } from 'next-auth/react'
type signUpObject = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
}
const Register = () => {
    const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false)
    const { register, handleSubmit } = useForm<signUpObject>({ shouldUseNativeValidation: true });
    const onSubmit = async (data: signUpObject) => { createUserWithEmailAndPassword(auth, data.email,data.password)
        .then((res) => {
            set(ref(db,"/users/" + res.user.uid + "/info/"), {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                language: "en"
            }).then(() => signIn("credentials", {email:data.email,password:data.password, redirect: true, callbackUrl: "/mainpage"}))
        })
    };
    
    return (
        <div className='h-screen overflow-hidden bg-[#FAFAFC]'>
            <div className="flex flex-col items-center text-black justify-center h-2/3">
                <div className='flex flex-col items-center md:w-1/4 md:shadow-2xl border-[#fff] md:rounded-2xl'>
                    <span className='font-bold text-[27px] md:mt-8'>Lets Register Account</span>
                    <span className='text-black mb-5'>Hello user , you have
                        a greatful journey</span>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-11/12'>
                        <input className='border mt-3 border-[#8E8383] rounded-lg w-full p-3' type="text" placeholder='Name' {...register("firstName", {
                            required: "Please Enter Your First Name.", minLength:3, maxLength:20, valueAsNumber:false
                        })}/>
                        <input className='border mt-3 border-[#8E8383] rounded-lg w-full p-3' type="text" placeholder='Lastname' {...register("lastName", {
                            required: "Please Enter Your Last Name.", minLength:3, maxLength:20, valueAsNumber:false
                        })}/>
                        <input className='border mt-3 border-[#8E8383] rounded-lg w-full p-3' type="text" placeholder='Email' autoComplete='email' {...register("email", {
                            required: "Please Enter Your Email.", pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}/>
                        <div className='w-full mt-3 relative'>
                            <input className='p-3 w-full border border-[#8E8383] rounded-lg' type={isPasswordOpen ? "text" : "password"} autoComplete='new-password' placeholder='Password' {...register("password", {
                            required: "Please Enter Your Last Name.", minLength:3, maxLength:20, 
                        })} />
                            <button className='absolute right-4 top-4' onClick={() => setIsPasswordOpen(!isPasswordOpen)}><EyeIcon /></button>
                        </div>
                        <input type="submit" className='bg-[#4A3AFF] mt-3 w-full  p-3 rounded-lg text-white font-semibold' value={"Sign Up"}/>
                    </form>
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
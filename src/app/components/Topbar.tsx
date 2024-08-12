"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Logo, DropdownIcon } from "../../../public/logo";
import ProtectedTopbar from './ProtectedTopbar';
import { getDictionary } from '../[lang]/dictionaries';
const Topbar = () => {
    const currentPath = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dict, setDict] = useState<any>();
    const notProtectedRoutes = ["/login", "/register", "/about", "/resources", "/about"]
    useEffect(() => {
        const fetchDict = async() => {
            setDict(await getDictionary(currentPath?.split("/")[1]))
        }
        fetchDict()
    }, [currentPath])
    return (
        <>
        {notProtectedRoutes.includes(currentPath!) ? (<div className='bg-white flex justify-between p-3'>
            <div className='flex items-center m-3'>
                <Link className='text-black flex' href="/">
                    <Logo />
                    <span className='mx-3 max-sm:hidden'>English Learning</span>
                </Link>
            </div>
            <div className='flex'>
                <Link className='m-3 text-[#5D5A88] border items-center p-1 rounded-[10px] flex md:hidden' href="/login">
                    <span className='px-2'>Login</span>
                </Link>
                <button className="inline-flex items-center p-2 text-sm font-medium text-center md:hidden" onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button">
                    <DropdownIcon />
                    <div className={`relative ${isDropdownOpen ? "block" : "hidden"}`}>
                        <div className="z-10 absolute right-0 top-5 bg-white divide-x divide-gray-100 rounded-lg shadow w-44 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <Link href="/about" className="block px-4 py-2 text-black">
                                        <span>About</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="block px-4 py-2 text-black" href="/resources">
                                        <span>Resources</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="block px-4 py-2 text-black" href="/contact">
                                        <span>Contact</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </button>
            </div>

            <div className='text-black m-4 justify-between hidden md:flex'>
                <Link href="/about" className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/about" ? "border-b-4 border-indigo-500" : "border-0"}`}>
                    <span>About</span>
                </Link>
                <Link className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/resources" ? "border-b-4 border-indigo-500" : "border-0"}`} href="/resources">
                    <span>Resources</span>
                </Link>
                <Link className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/contact" ? "border-b-4 border-indigo-500" : "border-0"}`} href="/contact">
                    <span>Contact</span>
                </Link>
                <Link className='mr-3 text-[#5D5A88] border flex items-center p-2 rounded-[10px]' href="/login">
                    <span className='px-2'>{currentPath === "/login" ? "Login" : "Logout"}</span>
                </Link>
                <Link className='group mr-3 text-[#5D5A88] border flex items-center rounded-[10px] bg-indigo-500' href="/get-started">
                    <span className='px-4 font-semibold text-white'>Get Started</span>
                </Link>
            </div>
        </div>) : <ProtectedTopbar dict={dict} currentPath={currentPath!} isDropdownOpen={isDropdownOpen}  setIsDropdownOpen={setIsDropdownOpen}/>}
        </>
    )
}

export default Topbar
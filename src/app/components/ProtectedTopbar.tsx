import Link from 'next/link'
import React from 'react'
import { DropdownIcon, Logo } from '../../../public/logo'
import { signOut, useSession } from 'next-auth/react';
type Props = {
    currentPath: string,
    isDropdownOpen: boolean;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dict: any;
}
const ProtectedTopbar = ({ currentPath, isDropdownOpen, setIsDropdownOpen, dict }: Props) => {
    const handleLogout = async () => {
        signOut()
    }
    return (
        <>
            {dict && <div className='bg-white flex justify-between p-3'>
                <div className='flex items-center m-3'>
                    <Link className='text-black flex' href="/">
                        <Logo />
                        <span className='mx-3 max-sm:hidden'>English Learning</span>
                    </Link>
                </div>
                <div className='flex'>
                    <button onClick={handleLogout} className='m-3 text-[#5D5A88] border items-center p-1 rounded-[10px] flex md:hidden'>
                        <span className='px-2'>{dict.dropdownButtons.logout}</span>
                    </button>
                    <button className="inline-flex items-center p-2 text-sm font-medium text-center md:hidden" onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button">
                        <DropdownIcon />
                        <div className={`relative ${isDropdownOpen ? "block" : "hidden"}`}>
                            <div className="z-10 absolute right-0 top-5 bg-white divide-x divide-gray-100 rounded-lg shadow w-44 dark:divide-gray-600">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <Link href="/mainpage" className="block px-4 py-2 text-black">
                                            <span>{dict.mainpage}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-2 text-black" href="/mainpage/context">
                                            <span>{dict.dropdownButtons.educationContext}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-2 text-black" href="/mainpage/exam">
                                            <span>{dict.dropdownButtons.exam}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-2 text-black" href="/settings">
                                            <span>{dict.dropdownButtons.settings}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </button>
                </div>

                <div className='text-black m-4 justify-between hidden md:flex'>
                    <Link href="/about" className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/mainpage" ? "border-b-4 border-indigo-500" : "border-0"}`}>
                        <span>{dict.mainpage}</span>
                    </Link>
                    <Link className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/mainpage/context" ? "border-b-4 border-indigo-500" : "border-0"}`} href="/mainpage/context">
                        <span>{dict.dropdownButtons.educationContext}</span>
                    </Link>
                    <Link className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/mainpage/exam" ? "border-b-4 border-indigo-500" : "border-0"}`} href="/mainpage/exam">
                        <span>{dict.dropdownButtons.exam}</span>
                    </Link>
                    <Link className={`mr-3 text-[#5D5A88] p-2 h-full ${currentPath === "/settings" ? "border-b-4 border-indigo-500" : "border-0"}`} href="/settings">
                        <span>{dict.dropdownButtons.settings}</span>
                    </Link>
                    <button className='mr-3 text-[#5D5A88] border flex items-center p-2 rounded-[10px]' onClick={handleLogout}>
                        <span>{dict.dropdownButtons.logout}</span>
                    </button>
                </div>
            </div>}
        </>
    )
}

export default ProtectedTopbar
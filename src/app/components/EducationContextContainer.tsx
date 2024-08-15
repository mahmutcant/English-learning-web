"use client"
import React, { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '../../../public/logo';

type ContainerElementsProps = {
    word: string,
    turkishMeans : string[],
    level?: string,
    mean: string,
}
const EducationContextContainer: React.FC<ContainerElementsProps> = ({word,turkishMeans,level,mean}) => {
    const [index, setIndex] = useState<number>(0);
    return (
        <div className='border-2 border-[#4A3AFF] my-3 p-5 rounded-2xl flex flex-col'>
            <div className='flex relative'>
                <span className='font-semibold m-3 max-w-72'>{word}</span>
                {level && <div className='absolute right-0 m-3 bg-[#FEC400] p-[10px] rounded-full flex justify-center font-bold'><span>{level}</span></div>}
            </div>
            {mean && (
                <div className='m-3'>
                    <span>{mean}</span>
                </div>
            )}
            <span className='m-3 font-semibold'>Turkish Means</span>
            {turkishMeans.length > 0 && (
                <div className='flex justify-evenly'>
                    <button onClick={() => setIndex(index > 0 ? index - 1 : index)}><ArrowLeftIcon /></button>
                    <span className='w-full text-center'>{turkishMeans[index]}</span>
                    <button onClick={() => setIndex(index + 1 < turkishMeans.length ? index + 1 : index)}><ArrowRightIcon /></button>
                </div>
            )}
            <button className='border font-semibold text-[14px] rounded-full mt-5 bg-[#4a3aff] text-white p-2'>Remove To Word List</button>
        </div>
    )
}

export default EducationContextContainer
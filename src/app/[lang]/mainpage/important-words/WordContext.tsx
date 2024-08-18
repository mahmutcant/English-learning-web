import React, { useState } from 'react'
export type WordContextModel = {
    item: string,
    value: string
}
const WordContext:React.FC<WordContextModel> = ({item, value}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 font-semibold text-gray-800 flex justify-between items-center"
            >
                <span>{item}</span>
                <span>{isOpen ? '-' : '+'}</span>
            </button>
            <div
                className={`transition-max-height duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'
                    }`}
            >
                <div className="p-4 text-gray-600">{value}</div>
            </div>
        </div>
  )
}

export default WordContext
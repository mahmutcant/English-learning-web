import React, { useState } from 'react'
export type WordContextModel = {
    item: string,
    value: string,
    index: string,
    saveKnownWord: (index:string,value:boolean) => void,
    isChecked: boolean
}
const WordContext: React.FC<WordContextModel> = ({ item, value, index, saveKnownWord,isChecked}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 font-semibold text-gray-800 flex justify-between items-center"
            >
                
                <span>{item}</span>
                <div className="">
                    <input
                        id="link-checkbox"
                        type="checkbox"
                        checked={isChecked}
                        className="w-4 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600
                dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3"
                        onClick={(e) => {e.stopPropagation(); saveKnownWord(index,e.currentTarget.checked)}}
                    />
                </div>
            </button>
            <div
                className={`transition-max-height duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
            >
                <div className="p-4 text-gray-600 text-center">{value}</div>
            </div>
        </div>
    )
}

export default WordContext
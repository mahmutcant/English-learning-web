import React, { useState } from 'react'
import { SearchResult, WordDetail } from '../model/SearchModel'
import { ArrowLeftIcon, ArrowRightIcon, ClearIcon } from '../../../public/logo';
type SearchResultContainerProps = {
    result: string,
    wordDetail: WordDetail,
    isHistory: boolean,
    deleteHistory?: (key: string) => void;
    saveToWordList: (key: WordDetail,word:string) => void;
};
const SearchResultContainer: React.FC<SearchResultContainerProps> = ({ result,wordDetail,isHistory,deleteHistory, saveToWordList }) => {
    const [index, setIndex] = useState<number>(0);
    return (
        <div>
            {result && <div className='border-2 border-[#4A3AFF] p-5 rounded-2xl flex flex-col'>
                <div className='flex relative'>
                    {(isHistory && deleteHistory) && <button className='absolute -right-3 -top-2' onClick={() => deleteHistory(result)}><ClearIcon/></button>}
                    <span className='font-semibold m-3'>{result}</span>
                    {wordDetail.level && <div className='absolute right-0 m-3 bg-[#FEC400] p-[10px] rounded-full flex justify-center font-bold'><span>{wordDetail.level}</span></div>}
                </div>
                {wordDetail.title && (
                    <div className='m-3'>
                        <span>{wordDetail.title}</span>
                    </div>
                )}
                <span className='m-3 font-semibold'>Turkish Means</span>
                {wordDetail.turkish_means && (
                    <div className='flex justify-evenly'>
                        <button onClick={() => setIndex(index > 0 ? index - 1: index)}><ArrowLeftIcon/></button>
                        <span className='w-full text-center'>{wordDetail.turkish_means[index]}</span>
                        <button onClick={() => setIndex(index + 1 < wordDetail.turkish_means.length ? index + 1 : index)}><ArrowRightIcon/></button>
                    </div>
                )}
                <button onClick={() => saveToWordList(wordDetail,result)} className='border font-semibold text-[14px] rounded-full mt-5 bg-[#4a3aff] text-white p-2'>Add to word list</button>
            </div>}
        </div>
    )
}

export default SearchResultContainer
"use client"
import { HistoryWordDetail, SearchResult, WordDetail } from '@/app/model/SearchModel';
import { getInformationByWord, Search } from '@/app/utils/api';
import React, { useEffect, useState } from 'react';
import { debounce } from "lodash"
import { ClearIcon, HistoryIcon, SearchIcon } from '../../../../public/logo';
import SearchResultContainer from '@/app/components/SearchResultContainer';
import LoadingAnimation from '@/app/components/LoadingAnimation';
import { ref, runTransaction, set } from 'firebase/database';
import { auth, db } from '@/firebase';
const SearchComponent = () => {
    const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult>();
    const [history, setHistory] = useState<HistoryWordDetail>({})
    const [wordDetail, setWordDetail] = useState<WordDetail>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isFocusOnSearch, setIsFocusOnSearch] = useState<boolean>(false);
    useEffect(() => {
        if (searchInput.length > 2) {
            handleSearch()
        } else {
            setSearchResult([])
        }
    }, [searchInput])

    const handleSearch = debounce(() => {
        Search(searchInput).then((data: SearchResult[]) => {
            setSearchResult(data)
        })
    }, 1000)
    const handleSelectedSearch = (item: SearchResult) => {
        setSelectedSearchResult(item);
        getInformation(item.word);
        saveHistory(item.word);
        setSearchInput(item.word)
    }
    const saveToWordList = (wordDetail: WordDetail, word: string) => {
        set(ref(db, 'users/' + auth.currentUser?.uid + "/education_context/" + word), "")
            .then(() => {
                const wordRef = ref(db, 'Words/' + word);
                runTransaction(wordRef, (currentData) => {
                    if (currentData) {
                        if (!currentData.count) {
                            currentData.count = 1;
                        } else {
                            currentData.count += 1;
                        }
                    } else {
                        currentData = {
                            word: wordDetail?.title.split(":")[0],
                            level: wordDetail?.level,
                            means: wordDetail?.turkish_means,
                            count: 1
                        };
                    }
                    return currentData;
                }).then(() => {
                    set(ref(db, 'users/' + auth.currentUser?.uid + "/education_context/" + word), "");
                }).catch((err) => {
                    console.log(err);
                });
            })
            .catch((err: any) => console.log(err));
    }
    const getInformation = (word: string) => {
        setLoading(true)
        getInformationByWord(word).then((data) => {
            setLoading(false)
            setWordDetail(data);
        }).catch(error => { setLoading(false); console.log(error); })
    }
    const saveHistory = async (word: string) => {
        if (wordDetail) {
            setHistory(prevHistory => ({
                [word]: wordDetail,
                ...history
            }));
        }
    }

    const removeHistoryItem = (key: string) => {
        setHistory(prevHistory => {
            const newHistory = { ...prevHistory };
            delete newHistory[key];
            return newHistory;
        });
    };

    return (
        <div className='flex justify-center'>
            <div className='w-80 md:w-96 m-5 relative'>
                <div className='absolute mt-3 ml-3'>
                    <SearchIcon />
                </div>
                <input
                    className={`w-full border ${searchResult.length > 0 ? "rounded-t-2xl" : "rounded-full"} p-3 pl-10 shadow-inner focus:outline-none`}
                    type='text'
                    onFocus={() => setIsFocusOnSearch(true)}
                    onBlur={() => setTimeout(() => setIsFocusOnSearch(false), 100)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={() => setSearchInput("")} className='absolute right-3 top-3'>
                    {searchInput && <ClearIcon />}
                </button>
                {(searchResult.length > 0 && isFocusOnSearch) && (
                    <div className={`flex flex-col ${searchResult.length > 0 && "border"} rounded-b-2xl`}>
                        {searchResult.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    handleSelectedSearch(item);
                                    if (isFocusOnSearch) {
                                        setIsFocusOnSearch(false);
                                    }
                                }}
                                className={`p-2 w-full flex justify-center ${index + 2 <= searchResult.length && "border-b-2"}`}
                            >
                                <span>{item.word}</span>
                            </button>
                        ))}
                    </div>
                )}
                <div className='mt-3'>
                    {loading && <div className='flex justify-center'><LoadingAnimation /></div>}
                    {(wordDetail && !loading) && <SearchResultContainer saveToWordList={saveToWordList} isHistory={false} wordDetail={wordDetail} result={selectedSearchResult!.word} />}
                </div>
                {Object.keys(history).length > 0 && <div className='flex justify-center items-center my-3'>
                    <div className='m-2'><HistoryIcon /></div>
                    <span className='font-bold m-2'>Geçmiş Aramalar</span>
                </div>}
                <div>
                    {Object.keys(history).filter(key => key && (key !== selectedSearchResult?.word)).map((key: string) =>
                        <div className='my-3'>
                            <SearchResultContainer saveToWordList={saveToWordList} wordDetail={history[key]} key={key} isHistory={true} result={key} deleteHistory={removeHistoryItem} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchComponent
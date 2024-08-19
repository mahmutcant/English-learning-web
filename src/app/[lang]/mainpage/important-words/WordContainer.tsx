"use client"
import React, { useEffect, useState } from 'react'
import WordContext from './WordContext';
import data from "../../../../../wordlist.json";
export type WordListObject = {
    [key: string]: { [word: string]: string };
};

const WordContainer = () => {
    const [wordList, setWordList] = useState<WordListObject>({})
    const [savedIndexes, setSavedIndexes] = useState<string[]>([]);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const [showKnonwWords, setKnownWords] = useState<boolean>(false);
    const [showUnknownWords, setShowUnknownWords] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("words") || "[]");
        setSavedIndexes(saved);
        setWordList(data)
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const saveKnownWord = (index: string, value: boolean) => {
        if (value) {
            if (!savedIndexes.includes(index)) {
                const updatedIndexes = [...savedIndexes, index];
                setSavedIndexes(updatedIndexes);
                localStorage.setItem("words", JSON.stringify(updatedIndexes));
            }
        } else {
            const updatedIndexes = savedIndexes.filter(i => i !== index);
            setSavedIndexes(updatedIndexes);
            localStorage.setItem("words", JSON.stringify(updatedIndexes));
        }
    }
    const matchesSearchTerm = (word: string) => {
        return word.toLowerCase().includes(searchTerm.toLowerCase())
    };
    const WordContainerReturner = (search?:string) => {
        if (showKnonwWords) {
            return (
                <>
                    {Object.keys(wordList)
                        .map(key => parseInt(key))
                        .filter(key => savedIndexes.includes(key.toString()))
                        .filter(key => matchesSearchTerm(Object.keys(wordList[key])[0]))
                        .map((key, index) => {
                            const wordObj = wordList[key];
                            const word = Object.keys(wordObj)[0];
                            const value = wordObj[word];
                            return (
                                <WordContext
                                    key={word + " " + index}
                                    item={word}
                                    value={value}
                                    index={key.toString()}
                                    saveKnownWord={saveKnownWord}
                                    isChecked={savedIndexes.includes(key.toString())}
                                />
                            );
                        })}
                </>
            );
        } else if (showUnknownWords) {
            return (
                <>
                    {Object.keys(wordList)
                        .map(key => parseInt(key))
                        .filter(key => !savedIndexes.includes(key.toString()))
                        .filter(key => matchesSearchTerm(Object.keys(wordList[key])[0]))
                        .map((key, index) => {
                            const wordObj = wordList[key];
                            const word = Object.keys(wordObj)[0];
                            const value = wordObj[word];
                            return (
                                <WordContext
                                    key={word + " " + index}
                                    item={word}
                                    value={value}
                                    index={key.toString()}
                                    saveKnownWord={saveKnownWord}
                                    isChecked={savedIndexes.includes(key.toString())}
                                />
                            );
                        })}
                </>
            );
        } else {
            return (
                <>
                    {Object.keys(wordList)
                        .map(key => parseInt(key))
                        .filter(key => matchesSearchTerm(Object.keys(wordList[key])[0]))
                        .map((key, index) => {
                            const wordObj = wordList[key];
                            const word = Object.keys(wordObj)[0];
                            const value = wordObj[word];
                            return (
                                <WordContext
                                    key={word + " " + index}
                                    item={word}
                                    value={value}
                                    index={key.toString()}
                                    saveKnownWord={saveKnownWord}
                                    isChecked={savedIndexes.includes(key.toString())}
                                />
                            );
                        })}
                </>
            );
        }
    };
    return (
        <div>
            <div className={`w-full bg-white mx-3 ${showScrollToTop && "fixed top-0"} flex items-center p-3`}>
                <input className='border rounded-full p-2' type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search' />
                <div className="flex flex-col mx-3">
                    <div className='flex items-center mb-3'>
                        <input id="default-checkbox" type="checkbox" value=""
                            onChange={(e) => setShowUnknownWords(e.currentTarget.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-600 text-[12px]">
                            Show Unknown Words
                        </label>
                    </div>
                    <div className='flex items-center mb-3'>
                        <input id="default-checkbox" type="checkbox"
                            onChange={(e) => setKnownWords(e.currentTarget.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-600 text-[12px]">
                            Show Known Words
                        </label>
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                {WordContainerReturner()}
            </div>
        </div>
    )
}

export default WordContainer
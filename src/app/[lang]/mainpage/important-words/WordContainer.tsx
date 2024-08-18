"use client"
import React, { useEffect, useState } from 'react'
import WordContext from './WordContext';
import data from "../../../../../wordlist.json";
type WordListObject = {
    [key: number]: { [word: string]: string };
};

const WordContainer = () => {
    const [wordList, setWordList] = useState<WordListObject>({})
    const [savedIndexes, setSavedIndexes] = useState<string[]>([]);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const [showKnonwWords, setKnownWords] = useState<boolean>(false);
    const [showUnknownWords, setShowUnknownWords] = useState<boolean>(false);
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
    useEffect(() => {
        console.log(showScrollToTop);

    }, [showScrollToTop])
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
    const WordContainerReturner = () => {
        if (showKnonwWords) {
            return (
                <>
                    {Object.keys(wordList)
                        .map(key => parseInt(key))
                        .filter(key => savedIndexes.includes(key.toString()))
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
                    {Object.values(wordList).map((wordObj, index) => {
                        const key = Object.keys(wordObj)[0];
                        const value = wordObj[key];
                        return (
                            <WordContext
                                key={key + " " + index}
                                item={key}
                                value={value}
                                index={Object.keys(wordList)[index]}
                                saveKnownWord={saveKnownWord}
                                isChecked={savedIndexes.includes(Object.keys(wordList)[index])}
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
                <input className='border rounded-full p-2' type="text" placeholder='Search' />
                <div className="flex flex-col mx-3">
                    <input id="default-checkbox" type="checkbox" value=""
                        onChange={(e) => setShowUnknownWords(e.currentTarget.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-600 text-[12px]">
                        Show Unknown Words
                    </label>
                    <input id="default-checkbox" type="checkbox"
                        onChange={(e) => setKnownWords(e.currentTarget.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-600 text-[12px]">
                        Show Known Words
                    </label>
                </div>
            </div>
            <div className='mt-3'>
                {WordContainerReturner()}
            </div>
        </div>
    )
}

export default WordContainer
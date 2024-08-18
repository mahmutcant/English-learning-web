"use client"
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import WordContext from './WordContext';
type WordListObject = {
    [key: number]: { [word: string]: string };
};
const WordContainer = () => {
    const [wordList, setWordList] = useState<WordListObject>({})
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const educationContextRef = ref(db, "Exams/YDS/word/");
                onValue(educationContextRef, (snapshot) => {

                    const data = snapshot.val() as WordListObject | null;

                    if (data) {
                        const words = Object.values(data).map(obj => {
                            const key = Object.keys(obj)[0];
                            return { [key]: obj[key] };
                        });

                        console.log(words);

                        setWordList(words);
                    } else {
                        setWordList({});
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            {wordList && Object.values(wordList).map((wordObj, index) => {
                const key = Object.keys(wordObj)[0];
                const value = wordObj[key];

                return (
                    <WordContext key={key + " " + index} item={key} value={value} />
                );
            })}
        </>
    )
}

export default WordContainer
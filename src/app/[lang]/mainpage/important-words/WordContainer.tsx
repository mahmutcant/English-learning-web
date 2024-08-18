"use client"
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import WordContext from './WordContext';
type WordListObjest = {
    [key: string] : string;
}
const WordContainer = () => {
    const [wordList,setWordList] = useState<WordListObjest>({})
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const educationContextRef = ref(db, "Exams/YDS/word/");
                onValue(educationContextRef, (snapshot) => {
                    
                    const data = snapshot.val();
                    console.log(data);
                    if (data) {
                        const words = Object.keys(data);
                        setWordList(data)
                    } else {
                        setWordList({})
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        console.log(wordList);
        
    }, [wordList])
    return (
        <>
        {wordList && Object.keys(wordList).map((key,index) => (
            <WordContext key={wordList[key] + " " + index} item={key} value={wordList[key]} />
        ))}
        </>
    )
}

export default WordContainer
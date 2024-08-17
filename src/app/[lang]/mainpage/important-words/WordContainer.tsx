"use client"
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import WordContext from './WordContext';

const WordContainer = () => {
    const [wordList,setWordList] = useState<string[]>([])
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const educationContextRef = ref(db, "Exams/YDS/word/");
                onValue(educationContextRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const words = Object.keys(data);
                        setWordList(words)
                    } else {
                        setWordList([])
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
        {wordList && wordList.map((item) => (
            <WordContext item={item} />
        ))}
        </>
    )
}

export default WordContainer
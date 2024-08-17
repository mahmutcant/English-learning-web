"use client"
import SearchResultContainer from '@/app/components/SearchResultContainer';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '../../../../../public/logo';
import EducationContextContainer from '@/app/components/EducationContextContainer';
export type EducationContextModel = {
    [key: string]: {
        level: string,
        word: string,
        means: string[]
    }
}
const ContextClientComponent = () => {
    const [educationContext, setEducationContext] = useState<EducationContextModel | undefined>(undefined);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const educationContextRef = ref(db, 'users/' + user.uid + "/education_context/");
                onValue(educationContextRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const words = Object.keys(data);
                        const wordDetailsPromises = words.map((word) => {
                            const wordRef = ref(db, "Words/" + word);
                            return get(wordRef).then((wordSnapshot) => {
                                return { [word]: wordSnapshot.val() };
                            });
                        });
                        Promise.all(wordDetailsPromises).then((wordDetailsArray) => {
                            const wordDetails = Object.assign({}, ...wordDetailsArray);
                            setEducationContext(wordDetails);
                        }).catch((err) => console.log(err));
                    } else {
                        setEducationContext(undefined);
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);
    return (
        <div className='w-80'>
            {educationContext && Object.keys(educationContext).map((key, index) => (
                <EducationContextContainer mean={educationContext[key].word} word={key} level={educationContext[key].level} turkishMeans={educationContext[key].means} key={key + " " + index}/>
            ))}
        </div>
    )
}

export default ContextClientComponent
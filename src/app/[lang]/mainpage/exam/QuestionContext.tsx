"use client"
import React, { useEffect, useState } from 'react'
import { EducationContextModel } from '../context/ContextClientComponent';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const QuestionContext = () => {
    const [educationContext, setEducationContext] = useState<EducationContextModel>();
    const [questions, setQuestions] = useState<{ question: string, options: string[], correctAnswer: string }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const educationContextRef = ref(db, 'users/' + user.uid + "/education_context/");
                onValue(educationContextRef, (snapshot) => {
                    const data = snapshot.val() as EducationContextModel | null;
                    setEducationContext(data!);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const generateQuestions = (data: EducationContextModel) => {
        const keys = Object.keys(data);
        const questions = keys.flatMap(key => {
            const word = data[key].word;
            const means = data[key].means ?? [];

            /*const questionType1 = {
                question: word,
                options: shuffleArray([key, ...getRandomKeys(keys, key, 3)]),
                correctAnswer: key,
            };

            const questionType2 = {
                question: key,
                options: shuffleArray([word, ...getRandomWords(data, word, 3)]),
                correctAnswer: word,
            };*/

            const questionType3 = means.length > 0 ? {
                question: `${key} kelimesinin anlamı nedir?`,
                options: shuffleArray([means[0], ...getRandomMeans(data, key, 3)]),
                correctAnswer: means[0],
            } : null;

            const questionType4 = means.length > 0 ? {
                question: `${means[0]} anlamına gelen İngilizce kelime nedir?`,
                options: shuffleArray([key, ...getRandomKeys(keys, key, 3)]),
                correctAnswer: key,
            } : null;

            return questionType3 && questionType4 ? [ questionType3, questionType4] : [questionType3, questionType4];
        });
        return shuffleArray(questions);
    };
    
    const getRandomKeys = (keys: string[], exclude: string, count: number) => {
        const filteredKeys = keys.filter(key => key !== exclude);
        const shuffled = shuffleArray(filteredKeys);
        return shuffled.slice(0, count);
    };

    const getRandomWords = (data: EducationContextModel, exclude: string, count: number) => {
        const words = Object.values(data).map(detail => detail.word);
        const filteredWords = words.filter(word => word !== exclude);
        const shuffled = shuffleArray(filteredWords);
        return shuffled.slice(0, count);
    };

    const getRandomMeans = (data: EducationContextModel, excludeKey: string, count: number) => {
        const means = Object.entries(data)
            .filter(([key, detail]) => key !== excludeKey)
            .flatMap(([key, detail]) => detail.means ?? []);
        const shuffled = shuffleArray(means);
        return shuffled.slice(0, count);
    };

    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleAnswerPress = (selectedOption: string, correctAnswer: string) => {
        setSelectedOption(selectedOption);
        setCorrectCount(selectedOption === correctAnswer ? (correctCount + 1) : correctCount);
        setWrongCount(selectedOption !== correctAnswer ? (wrongCount + 1) : wrongCount);

        setTimeout(() => {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
        }, 1000);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setCorrectCount(0);
        setWrongCount(0);
        const generatedQuestions = generateQuestions(educationContext!);
        setQuestions(generatedQuestions);
    };

    if (currentQuestionIndex >= questions.length) {
        if(currentQuestionIndex !== 0){
            return (
                <div className='flex flex-col h-96 items-center justify-center p-4 bg-white'>
                    <span className='text-[18px] mb-3'>Tebrikler, sınavı tamamladınız!</span>
                    <span className='text-[18px] mb-3'>{correctCount} adet doğru cevap verdiniz</span>
                    <span className='text-[18px] mb-3'>{wrongCount} adet yanlış cevap verdiniz</span>
                    <button className='border m-5 p-4 w-80 font-semibold rounded-full bg-[#4a3aff] text-white' onClick={handleRestart}>Baştan Başla</button>
                </div>
            );
        }else{
            return(
                <div className='flex justify-center h-96 items-center'>
                    <button onClick={handleRestart} className='border rounded-full m-5 py-3 bg-[#4a3aff] text-white font-semibold w-full'>Başla</button>
                </div>
            )
        }
    }

    const currentQuestion = questions[currentQuestionIndex];

  return (
        <>
            {educationContext && Object.keys(educationContext).length > 3 ? (
                <div className="flex p-2 m-5 justify-center bg-white">
                    <div className="mb-5">
                        <h2 className="text-[15px] mb-3">{currentQuestion.question}</h2>
                        {currentQuestion.options.map((option, i) => (
                            <button
                                key={i}
                                className={`bg-[#4a3aff] items-center p-5 mb-6 rounded-full text-white w-full ${selectedOption !== null && 
                                    (option === currentQuestion.correctAnswer
                                        ? 'bg-green-700'
                                        : option === selectedOption
                                            ? 'bg-red-700'
                                            : 'default')}`}
                                onClick={() => {
                                    setSelectedOption(option);
                                    handleAnswerPress(option, currentQuestion.correctAnswer);
                                }}
                                disabled={selectedOption !== null}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <p>Sınav yapabilmek için içeriğinizde en az 4 kelime olmalıdır.</p>
                </div>
            )}
        </>
    );
}

export default QuestionContext
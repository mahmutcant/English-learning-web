"use client"
import React, { useEffect, useState } from 'react'
import { EducationContextModel } from '../context/ContextClientComponent';
import { get, onValue, ref } from 'firebase/database';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import data from "../../../../../wordlist.json";
import { WordListObject } from '../important-words/WordContainer';
const QuestionContext = () => {
    const [educationContext, setEducationContext] = useState<EducationContextModel>();
    const [questions, setQuestions] = useState<{ question: string, options: string[], correctAnswer: string }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [examType, setExamType] = useState<string>("ec");
    
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

    const generateQuestionsForNewStructure = (data: WordListObject) => {
        const keys = Object.keys(data) as string[];
        const questions = keys.flatMap((key: string) => {
            const word = Object.keys(data[key])[0];
            const meaning = data[key][word];
            const questionType1 = {
                question: `${word} kelimesinin anlamı nedir?`,
                options: shuffleArray([meaning, ...getRandomMeansFromNewObject(data, word, 3,meaning)]),
                correctAnswer: meaning,
            };
    
            const questionType2 = {
                question: `${meaning} anlamına gelen İngilizce kelime nedir?`,
                options: shuffleArray([word, ...getRandomKeysFromNewObject(data, word, 3)]),
                correctAnswer: word,
            };
    
            return [questionType1, questionType2];
        });
        
        return shuffleArray(questions);
    };
    
    function getRandomMeansFromNewObject(data: WordListObject, currentWord: string, count: number,meaning:string): string[] {
        const allKeys = Object.values(data)
            .map((key) => {
                return Object.values(key)[0]
            })
            .filter(word => word !== currentWord);
    
        const selectedKeys: string[] = [];
    
        while (selectedKeys.length < count && allKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * allKeys.length);
            selectedKeys.push(allKeys.splice(randomIndex, 1)[0]);
        }
        return selectedKeys;
    }

    function getRandomKeysFromNewObject(data: WordListObject, currentWord: string, count: number): string[] {
        const allKeys = Object.keys(data)
            .map(key => Object.keys(data[key])[0])
            .filter(word => word !== currentWord);
    
        const selectedKeys: string[] = [];
    
        while (selectedKeys.length < count && allKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * allKeys.length);
            selectedKeys.push(allKeys.splice(randomIndex, 1)[0]);
        }
        
        return selectedKeys;
    }

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

    function shuffleArray<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5);
    }

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
        const generatedQuestionsType2 = generateQuestionsForNewStructure(data)
        const generatedQuestions = generateQuestions(educationContext!);
        if(examType === "ec"){            
            setQuestions(generatedQuestions.filter(q => q !== null) as { question: string; options: string[]; correctAnswer: string }[]);
        }else{
            setQuestions(generatedQuestionsType2.filter(q => q !== null) as { question: string; options: string[]; correctAnswer: string }[]);
        }
    };
    
    if (currentQuestionIndex >= questions.length) {
        if (currentQuestionIndex !== 0) {
            return (
                <div className='flex flex-col h-96 items-center justify-center p-4 bg-white'>
                    <span className='text-[18px] mb-3'>Tebrikler, sınavı tamamladınız!</span>
                    <span className='text-[18px] mb-3'>{correctCount} adet doğru cevap verdiniz</span>
                    <span className='text-[18px] mb-3'>{wrongCount} adet yanlış cevap verdiniz</span>
                    <button className='border m-5 p-4 w-80 font-semibold rounded-full bg-[#4a3aff] text-white' onClick={handleRestart}>Baştan Başla</button>
                </div>
            );
        } else {
            return (
                <div className='flex justify-center h-96 items-center flex-col'>
                    <form className="max-w-lg mx-auto">
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Choose Exam Type</label>
                        <select id="countries" onChange={(choice) => setExamType(choice.currentTarget.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="ec">Education Context</option>
                            <option value="yds">YDS</option>
                        </select>
                    </form>
                    <button onClick={handleRestart} className='border rounded-full m-5 py-3 bg-[#4a3aff] text-white font-semibold w-full'>Start</button>
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
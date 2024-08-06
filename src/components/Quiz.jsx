import React, { useEffect, useState } from 'react';

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentquestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectOption, setSelectOption] = useState(null);
    const [quizComplete, setQuizComplete] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    const api = 'https://opentdb.com/api.php?amount=10';
    const questiondata = async () => {
        try {
            const res = await fetch(api);
            const data = await res.json();
            setQuestions(data.results);
            setLoading(false);
            console.log(data);
        } catch (error) {
            console.log(error);
            setError("Failed to fetch questions");
            setLoading(false);
        }
    };

    useEffect(() => {
        questiondata();
    }, []);

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setSelectOption(null);
        if (currentquestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentquestionIndex + 1);
        } else {
            setQuizComplete(true);
        }
    };

    const handleOptionSelected = (option) => {
        setSelectOption(option);
        if (option === questions[currentquestionIndex].correct_answer) {
            setScore(score + 1);
        }
        setShowAnswer(true);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    if (questions.length === 0) {
        return <div>No more questions</div>;
    }

    const currentQuestion = questions[currentquestionIndex];
    const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

    return (
        <div className='w-screen h-screen bg-cyan-500 items-center flex justify-center flex-col'>
            <h1 className='text-3xl font-semibold font-sans text-white p-1'>QuizApp</h1>
            <hr className='border-x-[5px] border-s-orange-100 w-[120px]' />
            <div className='bg-slate-500 text-white p-4 flex flex-col gap-4 rounded-sm mt-8'>
            
                {!quizStarted ? (
                    
                    <>
                    <p className='text-xl text-white font-semibold'>Let's know your IQ level</p>
                    <button
                        className=' hover:bg-blue-500 text-white font-semibold hover:text-white p-2 border border-blue-500 hover:border-transparent rounded'
                        onClick={handleStartQuiz}
                    >
                        Let's Play🤷🤷
                    </button></>
                ) : !quizComplete ? (
                    <div className='bg-slate-500 text-xl text-white p-4 flex flex-col gap-4 rounded-sm m-2'>
                        <h2>{currentquestionIndex + 1}. {htmlDecode(currentQuestion.question)}</h2>
                        <div>
                            {options.map((option, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        name='option'
                                        id={`option-${index}`}
                                        checked={selectOption === option}
                                        onChange={() => handleOptionSelected(option)}
                                    />
                                    <label htmlFor={`option-${index}`}> {htmlDecode(option)}</label><br />
                                </div>
                            ))}
                            {showAnswer && (
                                <div>
                                    <p className='font-semibold pt-4'>
                                        {selectOption === currentQuestion.correct_answer
                                            ? "Hey, you have given the correct answer! 💐💐💐"
                                            : `Oops! Wrong answer🥺🥺🥺 The correct answer is ${currentQuestion.correct_answer}.`}
                                    </p>
                                    <button
                                        className='bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                        type='button'
                                        onClick={handleNextQuestion}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='font-sans text-xl text-white font-semibold'>
                        <h2>Quiz Completed!</h2>
                        <p>Your score is {score} out of {questions.length}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;

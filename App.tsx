
import React, { useState, useEffect, useCallback } from 'react';
import fetchQuizQuestions from './services/geminiService';
import { QuizQuestion as QuestionType, QuizOption } from './types';
import Question from './components/Question';
import Results from './components/Results';
import ProgressBar from './components/ProgressBar';

type GameState = 'start' | 'loading' | 'playing' | 'finished';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setGameState('loading');
    setError(null);
    try {
      const fetchedQuestions = await fetchQuizQuestions();
      if(fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setGameState('playing');
      } else {
        throw new Error("No questions were returned from the service.");
      }
    } catch (err) {
      setError('Failed to load the quiz. Please try again later.');
      console.error(err);
      setGameState('start');
    }
  }, []);

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    loadQuestions();
  };

  const handleAnswerSelect = (option: QuizOption) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    if (option.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState('finished');
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return (
          <div className="text-center p-10">
            <i className="fas fa-spinner fa-spin text-4xl text-teal-500"></i>
            <p className="mt-4 text-lg">Preparing the meadow...</p>
          </div>
        );
      case 'playing':
        if (questions.length === 0) return null;
        return (
          <>
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <div className="flex justify-between items-center mb-4 text-gray-500">
                <p className="font-bold text-lg">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <p className="font-bold text-lg">Score: {score}</p>
            </div>
            <Question
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswerSelect}
              selectedOption={selectedOption}
              isAnswered={isAnswered}
            />
            {isAnswered && (
              <div className="text-center mt-6">
                <button
                  onClick={handleNextQuestion}
                  className="bg-teal-500 text-white font-bold py-3 px-12 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            )}
          </>
        );
      case 'finished':
        return (
          <Results score={score} totalQuestions={questions.length} onRestart={handleStartQuiz} />
        );
      case 'start':
      default:
        return (
          <div className="text-center p-8">
            <i className="fas fa-feather-alt text-6xl text-teal-400 mb-4"></i>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Quantum Meadow Adventure</h1>
            <p className="text-lg text-gray-600 mb-8">Uncover the strange and wonderful secrets of the meadow!</p>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
            <button
              onClick={handleStartQuiz}
              className="bg-teal-500 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-teal-600 transition-transform transform hover:scale-105 shadow-lg"
            >
              Begin Adventure
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 via-green-50 to-teal-50">
      <main className="w-full max-w-2xl bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-200">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

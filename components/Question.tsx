
import React from 'react';
import { QuizQuestion as QuestionType, QuizOption } from '../types';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (option: QuizOption) => void;
  selectedOption: QuizOption | null;
  isAnswered: boolean;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, selectedOption, isAnswered }) => {

  const getOptionClass = (option: QuizOption) => {
    if (!isAnswered) {
      return `hover:bg-teal-100 ${selectedOption === option ? 'ring-2 ring-teal-500' : ''}`;
    }
    if (option.isCorrect) {
      return 'bg-green-200 text-green-900 border-green-400 font-bold';
    }
    if (selectedOption === option && !option.isCorrect) {
      return 'bg-red-200 text-red-900 border-red-400';
    }
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="w-full">
      <p className="text-xl md:text-2xl font-light text-center mb-6 leading-relaxed">{question.questionStory}</p>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-300 ${getOptionClass(option)} disabled:cursor-not-allowed`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option.text}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
          <h3 className="font-bold text-yellow-800">
            <i className="fas fa-lightbulb mr-2"></i>
            {question.quantumConcept}
            </h3>
          <p className="mt-2 text-yellow-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Question;

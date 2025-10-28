
import React from 'react';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  let message = '';
  let icon = '';

  if (percentage === 100) {
    message = "Perfect Score! You're a true quantum whisperer!";
    icon = 'fas fa-crown text-yellow-400';
  } else if (percentage >= 75) {
    message = "Excellent! You have a great intuition for the meadow's mysteries.";
    icon = 'fas fa-star text-yellow-400';
  } else if (percentage >= 50) {
    message = "Good job! The quantum world is tricky, but you're getting it.";
    icon = 'fas fa-seedling text-green-400';
  } else {
    message = "A good start! The meadow has many more secrets to reveal.";
    icon = 'fas fa-leaf text-green-400';
  }

  return (
    <div className="text-center p-8 flex flex-col items-center">
      <i className={`text-6xl mb-4 ${icon}`}></i>
      <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
      <p className="text-xl text-gray-600 mb-4">{message}</p>
      <p className="text-5xl font-bold text-teal-600 mb-6">
        {score} / {totalQuestions}
      </p>
      <button
        onClick={onRestart}
        className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default Results;

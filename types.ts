
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionStory: string;
  options: QuizOption[];
  explanation: string;
  quantumConcept: string;
}

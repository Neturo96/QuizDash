import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "playing" | "quiz" | "completed";

interface QuizState {
  question: string;
  answers: { text: string; isCorrect: boolean }[];
  isVisible: boolean;
}

interface QuizRunnerState {
  // Game state
  phase: GamePhase;
  score: number;
  runnerSpeed: number;
  runnerPosition: number;
  finishLinePosition: number;
  
  // Quiz state
  quiz: QuizState;
  usedQuestions: number[];
  
  // Particle effects
  showSpeedBoost: boolean;
  showSlowdown: boolean;
  
  // Actions
  startQuiz: () => void;
  answerQuiz: (isCorrect: boolean) => void;
  updateRunnerPosition: (delta: number) => void;
  resetGame: () => void;
  triggerSpeedBoost: () => void;
  triggerSlowdown: () => void;
  clearEffects: () => void;
}

// Quiz bank with multiple questions
const QUIZ_BANK = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "A) Paris", isCorrect: true },
      { text: "B) Para", isCorrect: false },
      { text: "C) Lyon", isCorrect: false },
    ],
  },
  {
    question: "What is 5 × 7?",
    answers: [
      { text: "A) 32", isCorrect: false },
      { text: "B) 35", isCorrect: true },
      { text: "C) 30", isCorrect: false },
    ],
  },
  {
    question: "Which planet is closest to the Sun?",
    answers: [
      { text: "A) Venus", isCorrect: false },
      { text: "B) Mercury", isCorrect: true },
      { text: "C) Earth", isCorrect: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "A) Atlantic", isCorrect: false },
      { text: "B) Indian", isCorrect: false },
      { text: "C) Pacific", isCorrect: true },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "A) Leonardo da Vinci", isCorrect: true },
      { text: "B) Picasso", isCorrect: false },
      { text: "C) Van Gogh", isCorrect: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "A) Go", isCorrect: false },
      { text: "B) Au", isCorrect: true },
      { text: "C) Gd", isCorrect: false },
    ],
  },
  {
    question: "How many sides does a hexagon have?",
    answers: [
      { text: "A) 5", isCorrect: false },
      { text: "B) 6", isCorrect: true },
      { text: "C) 7", isCorrect: false },
    ],
  },
  {
    question: "What year did World War II end?",
    answers: [
      { text: "A) 1944", isCorrect: false },
      { text: "B) 1945", isCorrect: true },
      { text: "C) 1946", isCorrect: false },
    ],
  },
  {
    question: "Which instrument has 88 keys?",
    answers: [
      { text: "A) Guitar", isCorrect: false },
      { text: "B) Piano", isCorrect: true },
      { text: "C) Violin", isCorrect: false },
    ],
  },
  {
    question: "What is the smallest continent?",
    answers: [
      { text: "A) Europe", isCorrect: false },
      { text: "B) Antarctica", isCorrect: false },
      { text: "C) Australia", isCorrect: true },
    ],
  },
];

// Function to get a random quiz question
function getRandomQuiz(usedQuestions: number[] = []): QuizState {
  const availableQuestions = QUIZ_BANK.filter((_, index) => !usedQuestions.includes(index));
  
  // If all questions have been used, reset and use all questions again
  const questionsToUse = availableQuestions.length > 0 ? availableQuestions : QUIZ_BANK;
  
  const randomIndex = Math.floor(Math.random() * questionsToUse.length);
  const selectedQuiz = questionsToUse[randomIndex];
  
  return {
    ...selectedQuiz,
    isVisible: false,
  };
}

const INITIAL_QUIZ = getRandomQuiz();

export const useQuizRunner = create<QuizRunnerState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    phase: "playing",
    score: 0,
    runnerSpeed: 2,
    runnerPosition: 0,
    finishLinePosition: 50,
    quiz: INITIAL_QUIZ,
    usedQuestions: [],
    showSpeedBoost: false,
    showSlowdown: false,
    
    startQuiz: () => {
      const currentState = get();
      const newQuiz = getRandomQuiz(currentState.usedQuestions);
      const quizIndex = QUIZ_BANK.findIndex(q => q.question === newQuiz.question);
      
      set({
        phase: "quiz",
        quiz: { ...newQuiz, isVisible: true },
        usedQuestions: [...currentState.usedQuestions, quizIndex]
      });
    },
    
    answerQuiz: (isCorrect: boolean) => {
      const currentState = get();
      
      if (isCorrect) {
        set({
          phase: "playing",
          score: currentState.score + 50,
          runnerSpeed: Math.min(currentState.runnerSpeed + 1, 5),
          quiz: { ...currentState.quiz, isVisible: false },
          showSpeedBoost: true,
        });
        
        // Clear speed boost effect after 2 seconds
        setTimeout(() => {
          set({ showSpeedBoost: false });
        }, 2000);
      } else {
        set({
          phase: "playing",
          score: Math.max(currentState.score - 10, 0),
          runnerSpeed: Math.max(currentState.runnerSpeed - 0.5, 0.5),
          quiz: { ...currentState.quiz, isVisible: false },
          showSlowdown: true,
        });
        
        // Clear slowdown effect after 2 seconds
        setTimeout(() => {
          set({ showSlowdown: false });
        }, 2000);
      }
    },
    
    updateRunnerPosition: (delta: number) => {
      const currentState = get();
      const newPosition = currentState.runnerPosition + currentState.runnerSpeed * delta;
      
      set({ runnerPosition: newPosition });
      
      // Check if runner reached finish line
      if (newPosition >= currentState.finishLinePosition && currentState.phase !== "completed") {
        set({ phase: "completed" });
      }
      
      // Trigger quiz at certain positions (every 15 units)
      if (Math.floor(newPosition / 15) > Math.floor(currentState.runnerPosition / 15) && 
          currentState.phase === "playing" && 
          newPosition < currentState.finishLinePosition - 5) {
        get().startQuiz();
      }
    },
    
    resetGame: () => {
      const newQuiz = getRandomQuiz();
      set({
        phase: "playing",
        score: 0,
        runnerSpeed: 2,
        runnerPosition: 0,
        quiz: newQuiz,
        usedQuestions: [],
        showSpeedBoost: false,
        showSlowdown: false,
      });
    },
    
    triggerSpeedBoost: () => {
      set({ showSpeedBoost: true });
      setTimeout(() => set({ showSpeedBoost: false }), 2000);
    },
    
    triggerSlowdown: () => {
      set({ showSlowdown: true });
      setTimeout(() => set({ showSlowdown: false }), 2000);
    },
    
    clearEffects: () => {
      set({ showSpeedBoost: false, showSlowdown: false });
    },
  }))
);

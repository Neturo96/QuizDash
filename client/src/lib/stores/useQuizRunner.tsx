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

const INITIAL_QUIZ = {
  question: "What is the capital of France?",
  answers: [
    { text: "A) Paris", isCorrect: true },
    { text: "B) Para", isCorrect: false },
    { text: "C) Lyon", isCorrect: false },
  ],
  isVisible: false,
};

export const useQuizRunner = create<QuizRunnerState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    phase: "playing",
    score: 0,
    runnerSpeed: 2,
    runnerPosition: 0,
    finishLinePosition: 50,
    quiz: INITIAL_QUIZ,
    showSpeedBoost: false,
    showSlowdown: false,
    
    startQuiz: () => {
      set({
        phase: "quiz",
        quiz: { ...INITIAL_QUIZ, isVisible: true }
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
      set({
        phase: "playing",
        score: 0,
        runnerSpeed: 2,
        runnerPosition: 0,
        quiz: INITIAL_QUIZ,
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

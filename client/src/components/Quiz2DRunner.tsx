import { useEffect, useRef, useState } from 'react';
import { useQuizRunner } from '../lib/stores/useQuizRunner';
import { useAudio } from '../lib/stores/useAudio';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

export default function Quiz2DRunner() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  
  const {
    phase,
    score,
    runnerSpeed,
    runnerPosition,
    finishLinePosition,
    quiz,
    showSpeedBoost,
    showSlowdown,
    updateRunnerPosition,
    answerQuiz,
    resetGame
  } = useQuizRunner();
  
  const { setBackgroundMusic, setHitSound, setSuccessSound, playHit, playSuccess } = useAudio();
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const bgMusic = new Audio('/sounds/background.mp3');
        const hitSound = new Audio('/sounds/hit.mp3');
        const successSound = new Audio('/sounds/success.mp3');
        
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        setBackgroundMusic(bgMusic);
        setHitSound(hitSound);
        setSuccessSound(successSound);
        
        // Start background music
        bgMusic.play().catch(console.log);
      } catch (error) {
        console.log("Audio loading failed:", error);
      }
    };
    
    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = () => {
      updateRunnerPosition(0.016); // ~60fps
    };
    
    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [updateRunnerPosition, gameStarted]);

  // Update runner position on screen
  useEffect(() => {
    if (runnerRef.current) {
      const progress = (runnerPosition / finishLinePosition) * 100;
      runnerRef.current.style.left = `${Math.min(progress, 100)}%`;
    }
  }, [runnerPosition, finishLinePosition]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playSuccess();
    } else {
      playHit();
    }
    answerQuiz(isCorrect);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleResetGame = () => {
    resetGame();
    setGameStarted(false);
  };

  const progress = Math.min((runnerPosition / finishLinePosition) * 100, 100);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-400 to-green-400 overflow-hidden">
      {/* Background Track */}
      <div className="absolute bottom-32 left-0 w-full h-20 bg-gray-700">
        {/* Track lane markers */}
        <div className="flex justify-between h-full items-center px-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="w-8 h-2 bg-white"></div>
          ))}
        </div>
      </div>

      {/* Grass/Ground */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-green-500"></div>

      {/* Trees decoration */}
      <div className="absolute bottom-52 left-0 w-full flex justify-between px-8">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-6 h-12 bg-green-600 rounded-full"></div>
            <div className="w-2 h-8 bg-brown-600 bg-amber-800"></div>
          </div>
        ))}
      </div>

      {/* Runner Character */}
      <div
        ref={runnerRef}
        className={`absolute bottom-44 transition-all duration-200 ${
          gameStarted ? 'animate-bounce' : ''
        } ${showSpeedBoost ? 'animate-pulse' : ''}`}
        style={{
          left: '5%',
          transform: 'translateX(-50%)',
          animationDuration: showSpeedBoost ? '0.3s' : '0.6s'
        }}
      >
        {/* Character body */}
        <div className="relative">
          {/* Main body */}
          <div className="w-8 h-12 bg-red-500 rounded-lg relative">
            {/* Face */}
            <div className="absolute top-1 left-1 w-6 h-6 bg-yellow-200 rounded-full">
              {/* Eyes */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
              {/* Smile */}
              <div className="absolute bottom-1 left-2 w-2 h-1 border-b-2 border-black rounded-full"></div>
            </div>
            
            {/* Arms */}
            <div className="absolute top-3 -left-2 w-3 h-1 bg-yellow-400 rounded transform rotate-45"></div>
            <div className="absolute top-3 -right-2 w-3 h-1 bg-yellow-400 rounded transform -rotate-45"></div>
            
            {/* Legs */}
            <div className="absolute bottom-0 left-1 w-1 h-4 bg-green-500"></div>
            <div className="absolute bottom-0 right-1 w-1 h-4 bg-green-500"></div>
          </div>
        </div>

        {/* Speed boost effect */}
        {showSpeedBoost && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-12 h-12 bg-yellow-400 rounded-full opacity-25"></div>
          </div>
        )}

        {/* Slowdown effect */}
        {showSlowdown && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="text-red-500 text-xs animate-bounce">💨</div>
          </div>
        )}
      </div>

      {/* Finish Line */}
      <div className="absolute bottom-44 right-8 flex flex-col items-center">
        <div className="text-4xl">🏁</div>
        <div className="text-sm font-bold">FINISH</div>
        {phase === "completed" && (
          <div className="absolute -top-8 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold animate-bounce">
            LEVEL COMPLETE! 🎉
          </div>
        )}
      </div>

      {/* Game Start Screen */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96 bg-white shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">🏃‍♂️ Quiz Runner</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4">
              <p>Run automatically and answer quiz questions to boost your speed!</p>
              <Button onClick={handleStartGame} className="bg-green-500 hover:bg-green-600 text-white">
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Popup */}
      {quiz.isVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96 bg-white shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Quiz Time!</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {quiz.question}
                </h3>
                
                <div className="space-y-3">
                  {quiz.answers.map((answer, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(answer.isCorrect)}
                      className={`w-full py-3 text-left font-medium ${
                        answer.isCorrect 
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {answer.text}
                    </Button>
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Correct: +50 points & speed boost!</p>
                  <p>Wrong: -10 points & slowdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Score UI - Top Right */}
      <div className="absolute top-4 right-4">
        <Card className="w-48 bg-white/90 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-bold">Score</h3>
                <div className="text-3xl font-bold text-blue-600">{score}</div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              
              <div className="text-sm space-y-1">
                <div>Speed: {runnerSpeed.toFixed(1)}x</div>
                <div>Distance: {runnerPosition.toFixed(1)}m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Status - Top Left */}
      <div className="absolute top-4 left-4">
        <Card className="bg-white/90 shadow-lg">
          <CardContent className="p-3">
            <div className="text-sm font-semibold">
              {phase === "playing" && "Running..."}
              {phase === "quiz" && "Answer the Quiz!"}
              {phase === "completed" && "Level Complete!"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Button - When completed */}
      {phase === "completed" && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleResetGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6"
          >
            Play Again
          </Button>
        </div>
      )}

      {/* Instructions - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <Card className="bg-black/70 text-white">
          <CardContent className="p-3">
            <div className="text-xs space-y-1">
              <div>🏃‍♂️ Auto-running character</div>
              <div>❓ Answer quizzes to boost speed</div>
              <div>🎯 Reach the finish line!</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
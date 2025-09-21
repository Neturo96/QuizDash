import { Html } from '@react-three/drei';
import { useQuizRunner } from '../lib/stores/useQuizRunner';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

export default function GameUI() {
  const score = useQuizRunner(state => state.score);
  const runnerPosition = useQuizRunner(state => state.runnerPosition);
  const finishLinePosition = useQuizRunner(state => state.finishLinePosition);
  const runnerSpeed = useQuizRunner(state => state.runnerSpeed);
  const phase = useQuizRunner(state => state.phase);
  const resetGame = useQuizRunner(state => state.resetGame);
  
  const progress = Math.min((runnerPosition / finishLinePosition) * 100, 100);
  
  return (
    <>
      {/* Score Bar - Right side */}
      <Html
        position={[0, 0, 0]}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          pointerEvents: 'auto',
          zIndex: 1000,
        }}
      >
        <Card className="w-48 bg-white/90 shadow-lg border-2 border-blue-300">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">Score</h3>
                <div className="text-3xl font-bold text-blue-600">{score}</div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>Speed: {runnerSpeed.toFixed(1)}x</div>
                <div>Distance: {runnerPosition.toFixed(1)}m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Html>
      
      {/* Game Status */}
      <Html
        position={[0, 0, 0]}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          pointerEvents: 'auto',
          zIndex: 1000,
        }}
      >
        <Card className="bg-white/90 shadow-lg border-2 border-green-300">
          <CardContent className="p-3">
            <div className="text-sm font-semibold text-gray-800">
              {phase === "playing" && "Running..."}
              {phase === "quiz" && "Answer the Quiz!"}
              {phase === "completed" && "Level Complete!"}
            </div>
          </CardContent>
        </Card>
      </Html>
      
      {/* Reset Button - Only show when completed */}
      {phase === "completed" && (
        <Html
          position={[0, 0, 0]}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            zIndex: 1000,
          }}
        >
          <Button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 text-lg"
          >
            Play Again
          </Button>
        </Html>
      )}
      
      {/* Instructions */}
      <Html
        position={[0, 0, 0]}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <Card className="bg-black/70 text-white border-gray-600">
          <CardContent className="p-3">
            <div className="text-xs space-y-1">
              <div>🏃‍♂️ Auto-running character</div>
              <div>❓ Answer quizzes to boost speed</div>
              <div>🎯 Reach the finish line!</div>
            </div>
          </CardContent>
        </Card>
      </Html>
    </>
  );
}

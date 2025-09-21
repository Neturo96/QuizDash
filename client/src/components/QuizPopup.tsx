import { Html } from '@react-three/drei';
import { useQuizRunner } from '../lib/stores/useQuizRunner';
import { useAudio } from '../lib/stores/useAudio';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function QuizPopup() {
  const quiz = useQuizRunner(state => state.quiz);
  const answerQuiz = useQuizRunner(state => state.answerQuiz);
  const { playHit, playSuccess } = useAudio();
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playSuccess();
    } else {
      playHit();
    }
    answerQuiz(isCorrect);
  };
  
  if (!quiz.isVisible) return null;
  
  return (
    <Html
      center
      position={[0, 2, 0]}
      style={{
        pointerEvents: 'auto',
      }}
    >
      <Card className="w-96 bg-white/95 shadow-2xl border-4 border-blue-400">
        <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Quiz Time!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
              {quiz.question}
            </h3>
            
            <div className="space-y-3">
              {quiz.answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(answer.isCorrect)}
                  className={`w-full py-3 text-left font-medium transition-all duration-200 ${
                    answer.isCorrect 
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  variant="default"
                >
                  {answer.text}
                </Button>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Correct answer: +50 points & speed boost!</p>
              <p>Wrong answer: -10 points & slowdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Html>
  );
}

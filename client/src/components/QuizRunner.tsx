import { useFrame } from "@react-three/fiber";
import { useQuizRunner } from "../lib/stores/useQuizRunner";
import { useAudio } from "../lib/stores/useAudio";
import { useEffect } from "react";
import RunnerCharacter from "./RunnerCharacter.tsx";
import Track from "./Track.tsx";
import FinishLine from "./FinishLine.tsx";
import QuizPopup from "./QuizPopup.tsx";
import GameUI from "./GameUI.tsx";
import ParticleEffects from "./ParticleEffects.tsx";

export default function QuizRunner() {
  const updateRunnerPosition = useQuizRunner(state => state.updateRunnerPosition);
  const runnerPosition = useQuizRunner(state => state.runnerPosition);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

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
  useFrame((state, delta) => {
    updateRunnerPosition(delta);
    
    // Update camera to follow runner
    state.camera.position.x = runnerPosition;
  });

  return (
    <group>
      {/* Game World */}
      <Track />
      <RunnerCharacter />
      <FinishLine />
      <ParticleEffects />
      
      {/* UI Overlays */}
      <QuizPopup />
      <GameUI />
    </group>
  );
}

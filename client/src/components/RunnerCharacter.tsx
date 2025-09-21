import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuizRunner } from '../lib/stores/useQuizRunner';

export default function RunnerCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);
  const runnerPosition = useQuizRunner(state => state.runnerPosition);
  const runnerSpeed = useQuizRunner(state => state.runnerSpeed);
  const phase = useQuizRunner(state => state.phase);
  
  useFrame((state, delta) => {
    if (meshRef.current && phase !== "completed") {
      // Simple running animation - bounce up and down
      const bounceHeight = Math.sin(state.clock.elapsedTime * 8) * 0.2;
      meshRef.current.position.y = 0.5 + bounceHeight;
      
      // Rotation based on speed for visual feedback
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.1;
      
      // Position based on game state
      meshRef.current.position.x = runnerPosition;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      {/* Character body - simple colorful box */}
      <boxGeometry args={[0.8, 1, 0.4]} />
      <meshStandardMaterial color="#FF6B6B" />
      
      {/* Simple face */}
      <mesh position={[0, 0.2, 0.21]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.3, 0.22]}>
        <circleGeometry args={[0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 0.3, 0.22]}>
        <circleGeometry args={[0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, 0.1, 0.22]} rotation={[0, 0, Math.PI]}>
        <ringGeometry args={[0.1, 0.12, 0, Math.PI]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#FFEB3B" />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#FFEB3B" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, -0.8, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      <mesh position={[0.2, -0.8, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
    </mesh>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useQuizRunner } from '../lib/stores/useQuizRunner';

export default function FinishLine() {
  const bannerRef = useRef<THREE.Group>(null);
  const finishLinePosition = useQuizRunner(state => state.finishLinePosition);
  const phase = useQuizRunner(state => state.phase);
  
  useFrame((state) => {
    if (bannerRef.current && phase === "completed") {
      // Gentle floating animation for the banner
      bannerRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[finishLinePosition, 0, 0]}>
      {/* Finish line posts */}
      <mesh position={[0, 1, 3]}>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1, -3]}>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Checkered finish line banner */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 6]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.8} />
      </mesh>
      
      {/* Checkered pattern */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0.01, 2.5, -2.5 + i]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#FFFFFF" : "#000000"} />
        </mesh>
      ))}
      
      {/* Completion banner */}
      {phase === "completed" && (
        <group ref={bannerRef} position={[0, 3, 0]}>
          <mesh>
            <planeGeometry args={[8, 2]} />
            <meshStandardMaterial color="#FFD700" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.8}
            color="#FF0000"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            LEVEL COMPLETE!
          </Text>
        </group>
      )}
      
      {/* Confetti-like decorations */}
      {phase === "completed" && Array.from({ length: 20 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 10,
            2 + Math.random() * 3,
            (Math.random() - 0.5) * 8
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)} />
        </mesh>
      ))}
    </group>
  );
}

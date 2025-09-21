import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuizRunner } from '../lib/stores/useQuizRunner';

export default function ParticleEffects() {
  const speedBoostRef = useRef<THREE.Points>(null);
  const slowdownRef = useRef<THREE.Points>(null);
  
  const showSpeedBoost = useQuizRunner(state => state.showSpeedBoost);
  const showSlowdown = useQuizRunner(state => state.showSlowdown);
  const runnerPosition = useQuizRunner(state => state.runnerPosition);
  
  // Speed boost particles (yellow glow)
  const speedBoostParticles = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    const velocities = new Float32Array(50 * 3);
    
    for (let i = 0; i < 50; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = Math.random() * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = Math.random() * 0.2 + 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, velocities };
  }, []);
  
  // Slowdown particles (red particles)
  const slowdownParticles = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    const velocities = new Float32Array(30 * 3);
    
    for (let i = 0; i < 30; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = Math.random() * 1.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      
      velocities[i3] = (Math.random() - 0.5) * 0.05;
      velocities[i3 + 1] = -Math.random() * 0.1 - 0.05;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    
    return { positions, velocities };
  }, []);
  
  useFrame((state, delta) => {
    // Update speed boost particles
    if (speedBoostRef.current && showSpeedBoost) {
      const positions = speedBoostRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += speedBoostParticles.velocities[i] * delta * 10;
        positions[i + 1] += speedBoostParticles.velocities[i + 1] * delta * 10;
        positions[i + 2] += speedBoostParticles.velocities[i + 2] * delta * 10;
        
        // Reset particles that go too high
        if (positions[i + 1] > 3) {
          positions[i] = (Math.random() - 0.5) * 2;
          positions[i + 1] = 0;
          positions[i + 2] = (Math.random() - 0.5) * 2;
        }
      }
      
      speedBoostRef.current.geometry.attributes.position.needsUpdate = true;
      speedBoostRef.current.position.x = runnerPosition;
    }
    
    // Update slowdown particles
    if (slowdownRef.current && showSlowdown) {
      const positions = slowdownRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += slowdownParticles.velocities[i] * delta * 10;
        positions[i + 1] += slowdownParticles.velocities[i + 1] * delta * 10;
        positions[i + 2] += slowdownParticles.velocities[i + 2] * delta * 10;
        
        // Reset particles that fall too low
        if (positions[i + 1] < -1) {
          positions[i] = (Math.random() - 0.5) * 2;
          positions[i + 1] = 1.5;
          positions[i + 2] = (Math.random() - 0.5) * 2;
        }
      }
      
      slowdownRef.current.geometry.attributes.position.needsUpdate = true;
      slowdownRef.current.position.x = runnerPosition;
    }
  });
  
  return (
    <group>
      {/* Speed boost particles */}
      {showSpeedBoost && (
        <points ref={speedBoostRef} position={[runnerPosition, 0.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={speedBoostParticles.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#FFD700"
            size={0.1}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      {/* Slowdown particles */}
      {showSlowdown && (
        <points ref={slowdownRef} position={[runnerPosition, 0.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={30}
              array={slowdownParticles.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#FF4444"
            size={0.15}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}

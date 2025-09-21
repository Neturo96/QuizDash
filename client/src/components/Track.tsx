import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Track() {
  const grassTexture = useTexture('/textures/grass.png');
  const asphaltTexture = useTexture('/textures/asphalt.png');
  
  // Configure texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 5);
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(20, 2);

  return (
    <group>
      {/* Ground - grass background */}
      <mesh position={[25, -1, 0]} receiveShadow>
        <boxGeometry args={[100, 0.1, 20]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Main track - asphalt */}
      <mesh position={[25, -0.95, 0]} receiveShadow>
        <boxGeometry args={[100, 0.1, 4]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Track lane markers */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[i * 5, -0.9, 0]}>
          <boxGeometry args={[2, 0.05, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Decorative elements along the track */}
      {Array.from({ length: 15 }, (_, i) => (
        <group key={i}>
          {/* Trees on the sides */}
          <mesh position={[i * 7, 0.5, 5]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
          <mesh position={[i * 7, -0.8, 5]}>
            <cylinderGeometry args={[0.2, 0.2, 1]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          
          <mesh position={[i * 7 + 3, 0.5, -5]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
          <mesh position={[i * 7 + 3, -0.8, -5]}>
            <cylinderGeometry args={[0.2, 0.2, 1]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
        </group>
      ))}
      
      {/* Colorful barriers */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <mesh position={[i * 10, 0, 2.5]}>
            <boxGeometry args={[0.5, 1, 0.2]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#FF5722" : "#2196F3"} />
          </mesh>
          <mesh position={[i * 10, 0, -2.5]}>
            <boxGeometry args={[0.5, 1, 0.2]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#FF5722" : "#2196F3"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

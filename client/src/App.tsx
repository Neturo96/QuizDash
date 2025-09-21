import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import QuizRunner from "./components/QuizRunner";
import Quiz2DRunner from "./components/Quiz2DRunner";

// WebGL detection function
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      // Type assertion for WebGL context
      const webglContext = gl as WebGLRenderingContext;
      // Additional check to ensure WebGL is actually working
      const version = webglContext.getParameter(webglContext.VERSION);
      const isWorking = version !== null;
      console.log('WebGL Support Check:', { gl: !!gl, isWorking, version });
      return isWorking;
    }
    console.log('WebGL Support Check: No WebGL context available');
    return false;
  } catch (e) {
    console.log('WebGL detection error:', e);
    return false;
  }
}

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "space", keys: ["Space"] },
];

// Main App component
function App() {
  // Use 2D version for stability
  return <Quiz2DRunner />;
}

export default App;

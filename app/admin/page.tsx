// src/pages/index.tsx

"use client";
import DraggableComponent from '../components/DraggableComponent';
import React, { useState, MouseEvent } from 'react';
const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  return (
    <div className="min-h-screen" onMouseMove={handleMouseMove} >
      <DraggableComponent mouse={mousePosition}/>
    </div>
  );
};

export default Home;

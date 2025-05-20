// App.js
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './components/Cube';

const App = () => {
  const cubeRef = useRef();

  const handleMove = (moveKey) => {
    if (cubeRef.current && !cubeRef.current.isRotating()) {
      cubeRef.current.rotate(moveKey);
    }
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Cube ref={cubeRef} />
          <OrbitControls />
        </Canvas>
      </div>

      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        {['R', 'L', 'U', 'D', 'F', 'B'].map((move) => (
          <button
            key={move}
            onClick={() => handleMove(move)}
            style={{ margin: 5, padding: '8px 12px', fontSize: 16 }}
          >
            {move}
          </button>
        ))}
      </div>
    </>
  );
};

export default App;

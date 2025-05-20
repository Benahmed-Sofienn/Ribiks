// Cubie.js
import React from 'react';
import { Box } from '@react-three/drei';

const faceColor = (faces, face) => faces?.[face] || 'black';

const Cubie = ({ position, faces = {} }) => {
  return (
    <Box args={[0.97, 0.97, 0.97]} position={position.map((n) => n - 1)}>
      <meshStandardMaterial attach="material-0" color={faceColor(faces, 'right')} />
      <meshStandardMaterial attach="material-1" color={faceColor(faces, 'left')} />
      <meshStandardMaterial attach="material-2" color={faceColor(faces, 'top')} />
      <meshStandardMaterial attach="material-3" color={faceColor(faces, 'bottom')} />
      <meshStandardMaterial attach="material-4" color={faceColor(faces, 'front')} />
      <meshStandardMaterial attach="material-5" color={faceColor(faces, 'back')} />
    </Box>
  );
};

export default Cubie;

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Cubie from './Cubie';

const initialFaces = (x, y, z) => ({
  front: z === 2 ? 'red' : 'black',
  back: z === 0 ? 'orange' : 'black',
  left: x === 0 ? 'blue' : 'black',
  right: x === 2 ? 'green' : 'black',
  top: y === 2 ? 'yellow' : 'black',
  bottom: y === 0 ? 'white' : 'black',
});

const moves = {
  R: {
    axis: new THREE.Vector3(1, 0, 0),
    slice: (cubie) => cubie.position[0] === 2,
    rotatePositions: ([x, y, z]) => [x, 2 - z, y],
    axisName: 'x',
  },
  L: {
  axis: new THREE.Vector3(-1, 0, 0), // ⬅ reversed axis
  slice: (cubie) => cubie.position[0] === 0,
  rotatePositions: ([x, y, z]) => [x, 2 - z, y], // ⬅ same as R
  axisName: 'x',
  },
  U: {
    axis: new THREE.Vector3(0, 1, 0),
    slice: (cubie) => cubie.position[1] === 2,
    rotatePositions: ([x, y, z]) => [2 - z, y, x],
    axisName: 'y',
  },
  D: {
    axis: new THREE.Vector3(0, 1, 0),
    slice: (cubie) => cubie.position[1] === 0,
    rotatePositions: ([x, y, z]) => [z, y, 2 - x],
    axisName: 'y',
  },
  F: {
    axis: new THREE.Vector3(0, 0, 1),
    slice: (cubie) => cubie.position[2] === 2,
    rotatePositions: ([x, y, z]) => [y, 2 - x, z],
    axisName: 'z',
  },
  B: {
    axis: new THREE.Vector3(0, 0, 1),
    slice: (cubie) => cubie.position[2] === 0,
    rotatePositions: ([x, y, z]) => [2 - y, x, z],
    axisName: 'z',
  },
};

const rotateFaceColors = (faces, axis, clockwise = true) => {
  const { top, bottom, front, back, left, right } = faces;

  if (axis === 'x') {
    return clockwise
      ? {
          top: back,
          back: bottom,
          bottom: front,
          front: top,
          left,
          right,
        }
      : {
          top: front,
          front: bottom,
          bottom: back,
          back: top,
          left,
          right,
        };
  }

  if (axis === 'y') {
    return clockwise
      ? {
          front: left,
          left: back,
          back: right,
          right: front,
          top,
          bottom,
        }
      : {
          front: right,
          right: back,
          back: left,
          left: front,
          top,
          bottom,
        };
  }

  if (axis === 'z') {
    return clockwise
      ? {
          top: left,
          left: bottom,
          bottom: right,
          right: top,
          front,
          back,
        }
      : {
          top: right,
          right: bottom,
          bottom: left,
          left: top,
          front,
          back,
        };
  }

  return faces;
};


const Cube = forwardRef((props, ref) => {
  const createInitialCube = () => {
    const cube = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          cube.push({
            position: [x, y, z],
            faces: initialFaces(x, y, z),
          });
        }
      }
    }
    return cube;
  };

  const [cube, setCube] = useState(createInitialCube);
  const rotatingGroup = useRef();
  const rotatingCubies = useRef([]);
  const animationAngle = useRef(0);
  const rotationAxis = useRef(new THREE.Vector3());
  const currentMove = useRef(null);
  const [rotating, setRotating] = useState(false);

  useImperativeHandle(ref, () => ({
    rotate: startRotationAnimation,
    isRotating: () => rotating,
  }));

  useFrame(() => {
    if (rotating && rotatingGroup.current) {
      rotatingGroup.current.rotation.set(0, 0, 0);
      rotatingGroup.current.rotateOnAxis(rotationAxis.current, animationAngle.current);
    }
  });

  const startRotationAnimation = (moveKey) => {
    if (rotating) return;

    setRotating(true);
    const move = moves[moveKey];
    currentMove.current = move;
    rotationAxis.current = move.axis;
    rotatingCubies.current = cube.filter(move.slice);
    animationAngle.current = 0;

    const animate = () => {
      animationAngle.current += 0.1;
      if (animationAngle.current >= Math.PI / 2) {
        animationAngle.current = Math.PI / 2;

        const newCube = cube.map((cubie) => {
          if (currentMove.current.slice(cubie)) {
            const newPos = currentMove.current.rotatePositions(cubie.position);
            const newFaces = rotateFaceColors(
  cubie.faces,
  currentMove.current.axisName,
  true // always clockwise
);


            return { position: newPos, faces: newFaces };
          } else {
            return cubie;
          }
        });

        setCube(newCube);
        setRotating(false);
        rotatingCubies.current = [];
        return;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  return (
    <>
      <group ref={rotatingGroup}>
        {rotatingCubies.current.map((cubie, idx) => (
          <Cubie key={`rot-${cubie.position.join('-')}`} {...cubie} />
        ))}
      </group>
      {cube
        .filter(
          (cubie) =>
            !rotatingCubies.current.some(
              (rc) => rc.position.join(',') === cubie.position.join(',')
            )
        )
        .map((cubie) => (
          <Cubie key={cubie.position.join('-')} {...cubie} />
        ))}
    </>
  );
});

export default Cube;


import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { useRef, useEffect, useState } from "react";

export const Experience = () => {
  const bookRef = useRef();
  const [rotation, setRotation] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  // Automatically rotate the book
 
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => {
        const newRot = prev + 0.01;
        // Update page index when rotation hits thresholds (example)
        const newPageIndex = Math.floor((newRot % (Math.PI * 2)) / (Math.PI / 2)) % 4; // Update for 4 pages, adjust if necessary
        setPageIndex(newPageIndex);
        return newRot;
      });
    }, 14);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  return (
    <>
      {/* Adding Float effect for vertical movement */}
      <Float
        rotation-x={-Math.PI / 10}
        floatIntensity={0.5}
        speed={1.5}
        rotationIntensity={3.0}
      >
        {/* Book with dynamic rotation */}
        <Book ref={bookRef} rotation={[0, rotation, 0]} />
      </Float>

      {/* OrbitControls for manual interaction */}
      <OrbitControls />
      
      {/* Environment with preset "studio" */}
      <Environment preset="studio" />

      {/* Right directional light */}
      <directionalLight
        position={[1, 4, 2]} // Light coming from the right side
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Left directional light */}
      <directionalLight
        position={[-1, 4, 2]} // Light coming from the left side
        intensity={2}
        castShadow={false}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Ground plane to receive shadows */}
      <mesh position-y={-1.25} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};


import React, { useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";
import { getMeshInfo } from "../../utils/gltf";
import type { GLTFResult } from "../../types/gltf";

interface AssetInfo {
  geometry: THREE.BufferGeometry | undefined;
  material: THREE.Material | undefined;
}

const Road = React.memo(function Road({
  roadTexture,
}: {
  roadTexture: THREE.Texture;
}) {
  return (
    <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[BOUNDARY_X * 2.4, BOUNDARY_Z * 2 + 16]} />
      <meshStandardMaterial
        map={roadTexture}
        color="#bbbbbb"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
});

const SideWalls = React.memo(function SideWalls({
  wall,
  pillar,
}: {
  wall: AssetInfo;
  pillar: AssetInfo;
}) {
  return (
    <>
      {[-BOUNDARY_X - 2, BOUNDARY_X + 2].map((x, i) => (
        <group key={`side-${i}`} position={[x, 0, 0]}>
          {Array.from({ length: 15 }).map((_, j) => (
            <group key={`block-${j}`} position={[0, 0, -BOUNDARY_Z + j * 3]}>
              <mesh
                geometry={wall.geometry}
                material={wall.material}
                rotation={[0, Math.PI / 2, 0]}
                scale={3}
                castShadow
                receiveShadow
              />
              {j % 4 === 0 && (
                <mesh
                  position={[i === 0 ? 1 : -1, 0, 0]}
                  geometry={pillar.geometry}
                  material={pillar.material}
                  scale={2}
                  castShadow
                />
              )}
            </group>
          ))}
        </group>
      ))}
    </>
  );
});

const Lightposts = React.memo(function Lightposts({
  light,
}: {
  light: AssetInfo;
}) {
  return (
    <>
      {[-BOUNDARY_X + 2, BOUNDARY_X - 2].map((x, i) => (
        <group key={`lights-${i}`} position={[x, 0, 0]}>
          {[-16, -8, 0, 8, 16].map((z) => (
            <mesh
              key={`light-${z}`}
              position={[0, 0, z]}
              geometry={light.geometry}
              material={light.material}
              scale={2.5}
              castShadow
            />
          ))}
        </group>
      ))}
    </>
  );
});

const CornerBuildings = React.memo(function CornerBuildings({
  cryptLarge,
}: {
  cryptLarge: AssetInfo;
}) {
  return (
    <>
      <group position={[-BOUNDARY_X - 1, 0, -BOUNDARY_Z + 5]}>
        <mesh
          geometry={cryptLarge.geometry}
          material={cryptLarge.material}
          scale={2}
          castShadow
          receiveShadow
        />
      </group>
      <group position={[BOUNDARY_X + 1, 0, -BOUNDARY_Z + 5]}>
        <mesh
          geometry={cryptLarge.geometry}
          material={cryptLarge.material}
          scale={2}
          castShadow
          receiveShadow
        />
      </group>
    </>
  );
});

const TownDetails = React.memo(function TownDetails({
  bench,
  urn,
  rocks,
  rockPositions,
}: {
  bench: AssetInfo;
  urn: AssetInfo;
  rocks: AssetInfo;
  rockPositions: {
    position: [number, number, number];
    scale: number;
    rotation: number;
  }[];
}) {
  return (
    <>
      <group position={[-BOUNDARY_X + 3, 0, 5]}>
        <mesh
          geometry={bench.geometry}
          material={bench.material}
          scale={2}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
        <mesh
          position={[0, 0, 2]}
          geometry={urn.geometry}
          material={urn.material}
          scale={1.5}
          castShadow
        />
      </group>

      <group position={[BOUNDARY_X - 3, 0, -5]}>
        <mesh
          geometry={bench.geometry}
          material={bench.material}
          scale={2}
          rotation={[0, -Math.PI / 2, 0]}
          castShadow
        />
        <mesh
          position={[0, 0, -2]}
          geometry={urn.geometry}
          material={urn.material}
          scale={1.5}
          castShadow
        />
      </group>

      {rockPositions.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={rock.position}
          geometry={rocks.geometry}
          material={rocks.material}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
});

export const TownEnvironment = React.memo(function TownEnvironment() {
  const wallGltf = useGLTF(
    "/assets/Models/GLB%20format/brick-wall.glb",
  ) as GLTFResult;
  const lightGltf = useGLTF(
    "/assets/Models/GLB%20format/lightpost-single.glb",
  ) as GLTFResult;
  const benchGltf = useGLTF(
    "/assets/Models/GLB%20format/bench.glb",
  ) as GLTFResult;
  const urnGltf = useGLTF(
    "/assets/Models/GLB%20format/urn-round.glb",
  ) as GLTFResult;

  const pillarGltf = useGLTF(
    "/assets/Models/GLB%20format/pillar-square.glb",
  ) as GLTFResult;
  const cryptLargeGltf = useGLTF(
    "/assets/Models/GLB%20format/crypt-large.glb",
  ) as GLTFResult;
  const rocksGltf = useGLTF(
    "/assets/Models/GLB%20format/rocks.glb",
  ) as GLTFResult;
  const roadTexture = useTexture("/assets/textures/road.png");

  // Configure road texture
  useEffect(() => {
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    // Calculate repeat based on road dimensions to keep texture square
    // Width is BOUNDARY_X * 2.4 (24 units), Height is BOUNDARY_Z * 2
    roadTexture.repeat.set(16, 24);
  }, [roadTexture]);

  const wall = getMeshInfo(wallGltf.nodes, wallGltf.materials, "brick-wall");
  const light = getMeshInfo(
    lightGltf.nodes,
    lightGltf.materials,
    "lightpost-single",
  );
  const bench = getMeshInfo(benchGltf.nodes, benchGltf.materials, "bench");
  const urn = getMeshInfo(urnGltf.nodes, urnGltf.materials, "urn-round");

  const pillar = getMeshInfo(
    pillarGltf.nodes,
    pillarGltf.materials,
    "pillar-square",
  );
  const cryptLarge = getMeshInfo(
    cryptLargeGltf.nodes,
    cryptLargeGltf.materials,
    "crypt-large",
  );
  const rocks = getMeshInfo(rocksGltf.nodes, rocksGltf.materials, "rocks");

  // Stable random positions for debris
  const rockPositions = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      position: [
        (Math.random() - 0.5) * BOUNDARY_X * 2.2,
        -0.2,
        (Math.random() - 0.5) * BOUNDARY_Z * 2.2,
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 1.5,
      rotation: Math.PI * Math.random(),
    }));
  }, []);

  return (
    <group>
      <Road roadTexture={roadTexture} />
      <SideWalls wall={wall} pillar={pillar} />
      <Lightposts light={light} />
      <CornerBuildings cryptLarge={cryptLarge} />
      <TownDetails
        bench={bench}
        urn={urn}
        rocks={rocks}
        rockPositions={rockPositions}
      />
    </group>
  );
});

useGLTF.preload("/assets/Models/GLB%20format/brick-wall.glb");
useGLTF.preload("/assets/Models/GLB%20format/lightpost-single.glb");
useGLTF.preload("/assets/Models/GLB%20format/bench.glb");
useGLTF.preload("/assets/Models/GLB%20format/urn-round.glb");

useGLTF.preload("/assets/Models/GLB%20format/pillar-square.glb");
useGLTF.preload("/assets/Models/GLB%20format/crypt-large.glb");
useGLTF.preload("/assets/Models/GLB%20format/rocks.glb");

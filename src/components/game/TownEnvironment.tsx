import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";

function getMeshInfo(nodes: any, materials: any, fallbackName: string) {
  const geometry =
    nodes[fallbackName]?.geometry ||
    (Object.values(nodes) as any[]).find((n) => n.geometry)?.geometry;
  const material = materials["*"] || Object.values(materials)[0];
  return { geometry, material };
}

export function TownEnvironment() {
  const wallGltf = useGLTF("/assets/Models/GLB%20format/brick-wall.glb") as any;
  const lightGltf = useGLTF(
    "/assets/Models/GLB%20format/lightpost-single.glb",
  ) as any;
  const benchGltf = useGLTF("/assets/Models/GLB%20format/bench.glb") as any;
  const urnGltf = useGLTF("/assets/Models/GLB%20format/urn-round.glb") as any;
  const roadGltf = useGLTF("/assets/Models/GLB%20format/road.glb") as any;
  const pillarGltf = useGLTF(
    "/assets/Models/GLB%20format/pillar-square.glb",
  ) as any;
  const cryptLargeGltf = useGLTF(
    "/assets/Models/GLB%20format/crypt-large.glb",
  ) as any;
  const rocksGltf = useGLTF("/assets/Models/GLB%20format/rocks.glb") as any;

  const wall = getMeshInfo(wallGltf.nodes, wallGltf.materials, "brick-wall");
  const light = getMeshInfo(
    lightGltf.nodes,
    lightGltf.materials,
    "lightpost-single",
  );
  const bench = getMeshInfo(benchGltf.nodes, benchGltf.materials, "bench");
  const urn = getMeshInfo(urnGltf.nodes, urnGltf.materials, "urn-round");
  const road = getMeshInfo(roadGltf.nodes, roadGltf.materials, "road");
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
      {/* Central Road */}
      <group position={[0, -0.45, 0]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={`road-${i}`}
            position={[0, 0, -BOUNDARY_Z + i * 4]}
            geometry={road.geometry}
            material={road.material}
            scale={[BOUNDARY_X / 2.5, 1, 1]}
            receiveShadow
          />
        ))}
      </group>

      {/* Side Buildings/Walls Layout */}
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

      {/* Lightposts along the road */}
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

      {/* Large Corner Buildings */}
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

      {/* Town Center Details */}
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

      {/* Scattered Rocks/Debris to break up the ground */}
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
    </group>
  );
}

useGLTF.preload("/assets/Models/GLB%20format/brick-wall.glb");
useGLTF.preload("/assets/Models/GLB%20format/lightpost-single.glb");
useGLTF.preload("/assets/Models/GLB%20format/bench.glb");
useGLTF.preload("/assets/Models/GLB%20format/urn-round.glb");
useGLTF.preload("/assets/Models/GLB%20format/road.glb");
useGLTF.preload("/assets/Models/GLB%20format/pillar-square.glb");
useGLTF.preload("/assets/Models/GLB%20format/crypt-large.glb");
useGLTF.preload("/assets/Models/GLB%20format/rocks.glb");

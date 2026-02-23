import React from "react";
import { useGLTF } from "@react-three/drei";
import { getMeshInfo } from "../../utils/gltf";
import type { GLTFResult } from "../../types/gltf";

export const Graveyard = React.memo(function Graveyard() {
  const { nodes: fenceNodes, materials: fenceMaterials } = useGLTF(
    "/assets/Models/GLB%20format/iron-fence.glb",
  ) as GLTFResult;
  const { nodes: gateNodes, materials: gateMaterials } = useGLTF(
    "/assets/Models/GLB%20format/iron-fence-border-gate.glb",
  ) as GLTFResult;
  const { nodes: graveNodes, materials: graveMaterials } = useGLTF(
    "/assets/Models/GLB%20format/grave.glb",
  ) as GLTFResult;
  const { nodes: stoneNodes, materials: stoneMaterials } = useGLTF(
    "/assets/Models/GLB%20format/gravestone-cross.glb",
  ) as GLTFResult;

  return (
    <group position={[0, 0, -25]}>
      {/* Central Gate */}
      <group position={[0, 0, 0]} scale={8}>
        <mesh
          {...getMeshInfo(gateNodes, gateMaterials, "iron-fence-border-gate")}
        />
      </group>

      {/* Fences */}
      {([-8, -4, 4, 8] as const).map((x, i) => (
        <group key={`fence-${i}`} position={[x, 0, 0]} scale={8}>
          <mesh {...getMeshInfo(fenceNodes, fenceMaterials, "iron-fence")} />
        </group>
      ))}

      {/* Graves scattered behind the gate */}
      {(
        [
          { pos: [-3, 0, -4], rot: 0.2 },
          { pos: [3, 0, -6], rot: -0.3 },
          { pos: [-6, 0, -8], rot: 0.5 },
          { pos: [6, 0, -5], rot: -0.1 },
        ] as const
      ).map((g, i) => (
        <group
          key={`grave-${i}`}
          position={g.pos}
          rotation={[0, g.rot, 0]}
          scale={6}
        >
          <mesh {...getMeshInfo(graveNodes, graveMaterials, "grave")} />
        </group>
      ))}

      {/* Gravestones */}
      {(
        [
          { pos: [-5, 0, -3], rot: -0.2 },
          { pos: [5, 0, -7], rot: 0.1 },
          { pos: [0, 0, -10], rot: 0 },
        ] as const
      ).map((s, i) => (
        <group
          key={`stone-${i}`}
          position={s.pos}
          rotation={[0, s.rot, 0]}
          scale={6}
        >
          <mesh
            {...getMeshInfo(stoneNodes, stoneMaterials, "gravestone-cross")}
          />
        </group>
      ))}
    </group>
  );
});

useGLTF.preload("/assets/Models/GLB%20format/iron-fence.glb");
useGLTF.preload("/assets/Models/GLB%20format/iron-fence-border-gate.glb");
useGLTF.preload("/assets/Models/GLB%20format/grave.glb");
useGLTF.preload("/assets/Models/GLB%20format/gravestone-cross.glb");

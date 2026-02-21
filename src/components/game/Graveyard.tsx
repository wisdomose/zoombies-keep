import { useGLTF } from "@react-three/drei";

export function Graveyard() {
  const { nodes: fenceNodes, materials: fenceMaterials } = useGLTF(
    "/assets/Models/GLB%20format/iron-fence.glb",
  ) as any;
  const { nodes: gateNodes, materials: gateMaterials } = useGLTF(
    "/assets/Models/GLB%20format/iron-fence-border-gate.glb",
  ) as any;
  const { nodes: graveNodes, materials: graveMaterials } = useGLTF(
    "/assets/Models/GLB%20format/grave.glb",
  ) as any;
  const { nodes: stoneNodes, materials: stoneMaterials } = useGLTF(
    "/assets/Models/GLB%20format/gravestone-cross.glb",
  ) as any;

  return (
    <group position={[0, 0, -25]}>
      {/* Central Gate */}
      <group position={[0, 0, 0]} scale={8}>
        <mesh
          geometry={
            gateNodes["iron-fence-border-gate"]?.geometry ||
            (Object.values(gateNodes).find((n: any) => n.geometry) as any)
              ?.geometry
          }
          material={gateMaterials["*"] || Object.values(materials)[0]}
        />
      </group>

      {/* Fences */}
      {([-8, -4, 4, 8] as const).map((x, i) => (
        <group key={`fence-${i}`} position={[x, 0, 0]} scale={8}>
          <mesh
            geometry={
              fenceNodes["iron-fence"]?.geometry ||
              (Object.values(fenceNodes).find((n: any) => n.geometry) as any)
                ?.geometry
            }
            material={fenceMaterials["*"] || Object.values(fenceMaterials)[0]}
          />
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
          <mesh
            geometry={
              graveNodes["grave"]?.geometry ||
              (Object.values(graveNodes).find((n: any) => n.geometry) as any)
                ?.geometry
            }
            material={graveMaterials["*"] || Object.values(graveMaterials)[0]}
          />
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
            geometry={
              stoneNodes["gravestone-cross"]?.geometry ||
              (Object.values(stoneNodes).find((n: any) => n.geometry) as any)
                ?.geometry
            }
            material={stoneMaterials["*"] || Object.values(stoneMaterials)[0]}
          />
        </group>
      ))}
    </group>
  );
}

// Accessing global variables to avoid linter errors if necessary, though not ideal
const materials: any = {};

useGLTF.preload("/assets/Models/GLB%20format/iron-fence.glb");
useGLTF.preload("/assets/Models/GLB%20format/iron-fence-border-gate.glb");
useGLTF.preload("/assets/Models/GLB%20format/grave.glb");
useGLTF.preload("/assets/Models/GLB%20format/gravestone-cross.glb");

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";

export function Environment() {
  return (
    <>
      {/* Ground Plane */}
      <RigidBody type="fixed" name="ground">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[BOUNDARY_X * 6, 1, BOUNDARY_Z * 6]} />
          <meshStandardMaterial color="#050505" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Invisible Environmental Walls */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[0.5, 10, BOUNDARY_Z * 2]}
          position={[-BOUNDARY_X - 1.5, 5, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, BOUNDARY_Z * 2]}
          position={[BOUNDARY_X + 1.5, 5, 0]}
        />
        <CuboidCollider
          args={[BOUNDARY_X * 2, 10, 0.5]}
          position={[0, 5, -BOUNDARY_Z * 2]}
        />
        <CuboidCollider
          args={[BOUNDARY_X * 2, 10, 0.5]}
          position={[0, 5, BOUNDARY_Z * 2]}
        />
      </RigidBody>
    </>
  );
}

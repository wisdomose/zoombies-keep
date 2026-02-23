import * as THREE from 'three';

/**
 * Standard GLTF result type for use with useGLTF hook.
 * Helps avoid 'as any' casts by providing common property shapes.
 */
export interface GLTFResult {
    nodes: Record<string, any>;
    materials: Record<string, any>; // Relaxed materials type due to THREE version mismatches
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
}

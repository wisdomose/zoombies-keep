import type { GLTFResult } from "../types/gltf";

export function getMeshInfo(
    nodes: GLTFResult["nodes"],
    materials: GLTFResult["materials"],
    fallbackName: string,
) {
    const geometry =
        nodes[fallbackName]?.geometry ||
        (Object.values(nodes) as any[]).find((n) => n.geometry)?.geometry;
    const material = materials["*"] || Object.values(materials)[0];
    return { geometry, material };
}

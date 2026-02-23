import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";

export function useWalkAnimation(
    actions: ReturnType<typeof useAnimations>["actions"],
    names: string[],
    fadeMs = 0.2,
): void {
    useEffect(() => {
        // Play walk animation
        const walkAnim =
            names.find((n) => n.toLowerCase().includes("walk")) || names[0];

        if (walkAnim && actions[walkAnim]) {
            actions[walkAnim].reset().fadeIn(fadeMs).play();
        }

        return () => {
            if (walkAnim && actions[walkAnim]) {
                actions[walkAnim].fadeOut(fadeMs);
            }
        };
    }, [actions, names, fadeMs]);
}

/**
 * Utility for managing game audio including sound effects and background music.
 */

let bumpCooldown = 0;
let themeAudio: HTMLAudioElement | null = null;

export const AudioUtils = {
    /**
     * Plays the "bump" sound effect with a cooldown to prevent overlapping distortion.
     */
    playBump: () => {
        const now = Date.now();
        if (now - bumpCooldown < 50) return;

        bumpCooldown = now;
        const audio = new Audio("/assets/audio/bump.mp3");
        audio.volume = 0.8;
        audio.play().catch(() => {
            /* Ignore autoplay restrictions errors */
        });
    },

    /**
     * Starts the main theme music in a loop.
     */
    playTheme: () => {
        if (themeAudio) return; // Already playing

        themeAudio = new Audio("/assets/audio/theme.mp3");
        themeAudio.loop = true;
        themeAudio.volume = 0.15;
        themeAudio.play().catch(() => {
            /* Autoplay often requires user interaction first */
            console.warn("Theme music failed to play. Interaction required.");
            themeAudio = null;
        });
    },

    /**
     * Stops the theme music.
     */
    stopTheme: () => {
        if (themeAudio) {
            themeAudio.pause();
            themeAudio = null;
        }
    }
};

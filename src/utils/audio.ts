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
    },

    /**
     * Pauses the theme music without clearing the instance.
     */
    pauseTheme: () => {
        if (themeAudio && !themeAudio.paused) {
            themeAudio.pause();
        }
    },

    /**
     * Resumes the theme music if it was paused.
     */
    resumeTheme: () => {
        if (themeAudio && themeAudio.paused) {
            themeAudio.play().catch(() => {
                /* Playback might fail if user hasn't interacted with the page yet */
            });
        }
    },

    /**
     * Complete cleanup of all audio resources.
     */
    cleanup: () => {
        AudioUtils.stopTheme();
    }
};

let wasPlayingBeforeHide = false;

// Handle cleanup when the page is closed or navigation happens
if (typeof window !== "undefined") {
    window.addEventListener("pagehide", () => {
        AudioUtils.stopTheme();
    });

    // Handle visibility change to pause music when tab is hidden and resume when shown
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            // Track if it was playing so we know whether to resume
            wasPlayingBeforeHide = themeAudio !== null && !themeAudio.paused;
            AudioUtils.pauseTheme();
        } else if (document.visibilityState === "visible") {
            if (wasPlayingBeforeHide) {
                AudioUtils.resumeTheme();
            }
        }
    });
}

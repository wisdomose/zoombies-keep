/**
 * Utility for triggering haptic feedback on supported devices.
 * Uses the Vibration API (navigator.vibrate).
 */

export const Haptics = {
    /**
     * Triggers a light vibration for minor impacts (e.g., unit hits).
     */
    light: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(15);
        }
    },

    /**
     * Triggers a heavier vibration for major events (e.g., base damage).
     */
    heavy: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([40, 20, 40]);
        }
    },

    /**
     * Triggers a custom vibration pattern.
     */
    vibrate: (pattern: number | number[]) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
};

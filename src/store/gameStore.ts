import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import {
    INITIAL_ALLY_STRENGTH,
    BOSS_INITIAL_STRENGTH_BASE,
    BOSS_STRENGTH_PER_WAVE,
    NORMAL_ENEMY_STRENGTH,
} from '../constants/game'

export interface Ally {
    id: string
    position: [number, number, number]
    strength: number
    canMultiply?: boolean
}

export interface Enemy {
    id: string
    position: [number, number, number]
    strength: number
    isBoss: boolean
    speedMultiplier: number
}

interface MultiplierZone {
    id: string
    position: [number, number, number]
    multiplier: number
    width: number
}

export interface SpawnEnemyOptions {
    isBoss?: boolean
    speedMultiplier?: number
    waveLevel?: number
}

interface GameState {
    baseHealth: number
    score: number
    highScore: number
    allies: Ally[]
    enemies: Enemy[]
    zones: MultiplierZone[]
    level: number
    isPaused: boolean
    status: 'splash' | 'menu' | 'playing' | 'gameover'
    dismissSplash: () => void
    spawnAlly: (position: [number, number, number], canMultiply?: boolean) => void
    spawnEnemy: (position: [number, number, number], options?: SpawnEnemyOptions) => void
    removeAlly: (id: string) => void
    damageAlly: (id: string, amount: number) => void
    removeEnemy: (id: string, incrementScore?: boolean) => void
    damageEnemy: (id: string, amount: number) => void
    damageBase: (amount: number) => void
    resetGame: () => void
    startGame: () => void
    togglePause: (force?: boolean) => void
    setLevel: (level: number) => void
}

const INITIAL_HEALTH = 100
const HIGH_SCORE_KEY = 'ghost_game_highscore'
const BOSS_SCORE = 10
const NORMAL_SCORE = 1

export const BOUNDARY_X = 10
export const BOUNDARY_Z = 20

function getEnemyScore(enemy: Enemy): number {
    return enemy.isBoss ? BOSS_SCORE : NORMAL_SCORE
}

function getHighScore(): number {
    if (typeof window === 'undefined') return 0
    try {
        return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10)
    } catch (e) {
        console.warn('Failed to get high score from localStorage', e)
        return 0
    }
}

function saveHighScore(score: number): void {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(HIGH_SCORE_KEY, score.toString())
        } catch (e) {
            console.warn('Failed to save high score to localStorage', e)
        }
    }
}

export const useGameStore = create<GameState>()(
    subscribeWithSelector((set) => ({
        baseHealth: INITIAL_HEALTH,
        score: 0,
        highScore: getHighScore(),
        level: 1,
        isPaused: false,
        allies: [],
        enemies: [],
        zones: [
            { id: 'zone-1', position: [0, 0.5, 0], multiplier: 2, width: 6 },
            { id: 'zone-2', position: [0, 0.5, -10], multiplier: 2, width: 4 }
        ],
        status: 'splash',

        spawnAlly: (position, canMultiply = true) => set((state) => ({
            allies: [...state.allies, { id: crypto.randomUUID(), position, strength: INITIAL_ALLY_STRENGTH, canMultiply }]
        })),

        spawnEnemy: (position, options) => set((state) => {
            const isBoss = options?.isBoss ?? false
            const waveLevel = options?.waveLevel ?? 1
            const strength = isBoss
                ? BOSS_INITIAL_STRENGTH_BASE + (waveLevel - 1) * BOSS_STRENGTH_PER_WAVE
                : NORMAL_ENEMY_STRENGTH

            return {
                enemies: [...state.enemies, {
                    id: crypto.randomUUID(),
                    position,
                    strength,
                    isBoss,
                    speedMultiplier: options?.speedMultiplier ?? 1,
                }]
            }
        }),

        removeAlly: (id) => set((state) => ({
            allies: state.allies.filter((a) => a.id !== id)
        })),

        damageAlly: (id, amount) => set((state) => {
            const ally = state.allies.find((a) => a.id === id)
            if (!ally) return state

            const newStrength = ally.strength - amount
            if (newStrength <= 0) {
                return { allies: state.allies.filter((a) => a.id !== id) }
            }

            return {
                allies: state.allies.map((a) => a.id === id ? { ...a, strength: newStrength } : a)
            }
        }),

        damageEnemy: (id, amount) => set((state) => {
            const enemy = state.enemies.find((e) => e.id === id)
            if (!enemy) return state

            const newStrength = enemy.strength - amount
            if (newStrength <= 0) {
                return {
                    enemies: state.enemies.filter((e) => e.id !== id),
                    score: state.score + getEnemyScore(enemy),
                }
            }

            return {
                enemies: state.enemies.map((e) => e.id === id ? { ...e, strength: newStrength } : e)
            }
        }),

        removeEnemy: (id, incrementScore = true) => set((state) => {
            const enemy = state.enemies.find((e) => e.id === id)
            return {
                enemies: state.enemies.filter((e) => e.id !== id),
                score: incrementScore && enemy ? state.score + getEnemyScore(enemy) : state.score,
            }
        }),

        dismissSplash: () => set((state) => {
            if (state.status === 'splash') {
                return { status: 'menu' }
            }
            return state
        }),

        damageBase: (amount) => set((state) => {
            const newHealth = Math.max(0, state.baseHealth - amount)
            const isGameOver = newHealth === 0

            const gameOverState = {
                baseHealth: newHealth,
                status: 'gameover' as const,
                allies: [],
                enemies: [],
                isPaused: false,
            }

            if (isGameOver && state.score > state.highScore) {
                saveHighScore(state.score)
                return {
                    ...gameOverState,
                    highScore: state.score,
                }
            }

            return {
                baseHealth: newHealth,
                allies: isGameOver ? [] : state.allies,
                enemies: isGameOver ? [] : state.enemies,
                isPaused: isGameOver ? false : state.isPaused,
                status: isGameOver ? 'gameover' : 'playing',
            }
        }),

        resetGame: () => set({
            baseHealth: INITIAL_HEALTH,
            score: 0,
            level: 1,
            isPaused: false,
            allies: [],
            enemies: [],
            status: 'menu',
        }),

        startGame: () => set({
            baseHealth: INITIAL_HEALTH,
            score: 0,
            level: 1,
            isPaused: false,
            allies: [],
            enemies: [],
            status: 'playing',
        }),

        togglePause: (force) => set((state) => ({
            isPaused: force !== undefined ? force : !state.isPaused
        })),

        setLevel: (level) => set({ level }),
    }))
)

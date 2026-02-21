import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface Entity {
    id: string
    position: [number, number, number]
    strength: number
    canMultiply?: boolean
}

interface MultiplierZone extends Omit<Entity, 'strength'> {
    multiplier: number
    width: number
}

interface GameState {
    baseHealth: number
    score: number
    highScore: number
    allies: Entity[]
    enemies: Entity[]
    zones: MultiplierZone[]
    status: 'menu' | 'playing' | 'gameover'
    spawnAlly: (position: [number, number, number], canMultiply?: boolean) => void
    spawnEnemy: (position: [number, number, number]) => void
    removeAlly: (id: string) => void
    damageAlly: (id: string, amount: number) => void
    removeEnemy: (id: string, incrementScore?: boolean) => void
    damageBase: (amount: number) => void
    resetGame: () => void
    startGame: () => void
}

const INITIAL_HEALTH = 100
export const BOUNDARY_X = 10
export const BOUNDARY_Z = 20

const getHighScore = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ghost_game_highscore')
        return saved ? parseInt(saved) : 0
    }
    return 0
}

const saveHighScore = (score: number) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('ghost_game_highscore', score.toString())
    }
}

export const useGameStore = create<GameState>()(
    subscribeWithSelector((set) => ({
        baseHealth: INITIAL_HEALTH,
        score: 0,
        highScore: getHighScore(),
        allies: [],
        enemies: [],
        zones: [
            { id: 'zone-1', position: [0, 0.5, 0], multiplier: 2, width: 6 },
            { id: 'zone-2', position: [0, 0.5, -10], multiplier: 2, width: 4 }
        ],
        status: 'menu',

        spawnAlly: (position, canMultiply = true) => set((state) => ({
            allies: [...state.allies, { id: crypto.randomUUID(), position, strength: 3, canMultiply }]
        })),

        spawnEnemy: (position) => set((state) => ({
            enemies: [...state.enemies, { id: crypto.randomUUID(), position, strength: 1 }]
        })),

        removeAlly: (id) => set((state) => ({
            allies: state.allies.filter((a) => a.id !== id)
        })),

        damageAlly: (id, amount) => set((state) => {
            const ally = state.allies.find(a => a.id === id);
            if (!ally) return state;

            const newStrength = ally.strength - amount;
            if (newStrength <= 0) {
                return { allies: state.allies.filter(a => a.id !== id) };
            }

            return {
                allies: state.allies.map(a => a.id === id ? { ...a, strength: newStrength } : a)
            };
        }),

        removeEnemy: (id, incrementScore = true) => set((state) => ({
            enemies: state.enemies.filter((e) => e.id !== id),
            score: incrementScore ? state.score + 1 : state.score
        })),

        damageBase: (amount) => set((state) => {
            const newHealth = Math.max(0, state.baseHealth - amount)
            const isGameOver = newHealth === 0

            if (isGameOver && state.score > state.highScore) {
                saveHighScore(state.score)
                return {
                    baseHealth: newHealth,
                    status: 'gameover',
                    highScore: state.score
                }
            }

            return {
                baseHealth: newHealth,
                status: isGameOver ? 'gameover' : 'playing'
            }
        }),

        resetGame: () => set({
            baseHealth: INITIAL_HEALTH,
            score: 0,
            allies: [],
            enemies: [],
            status: 'menu'
        }),

        startGame: () => set({
            baseHealth: INITIAL_HEALTH,
            score: 0,
            allies: [],
            enemies: [],
            status: 'playing'
        })
    }))
)

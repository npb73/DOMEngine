import { create } from 'zustand';

export interface Enemy {
  x: number;
  y: number;
  type: string;
  speed: number;
  hp: number;
  maxHp: number;
  animationKey: number;
  animationLength: number;
  size: number,
  damage: number,
  id: number
}

interface EnemyState {
  enemies: Enemy[];
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (index: number) => void;
  moveEnemy: (index: number, deltaX: number, deltaY: number) => void;
  updateEnemyHp: (index: number, hp: number) => void;
}

const useEnemyStore = create<EnemyState>((set) => ({
  enemies: [],

  addEnemy: (enemy: Enemy) => set((state) => ({
    enemies: [...state.enemies, enemy],
  })),

  removeEnemy: (id: number) => set((state) => ({
    enemies: state.enemies.filter((el) => el.id !== id),
  })),

  moveEnemy: (index: number, deltaX: number, deltaY: number) => set((state) => {
    const enemies = [...state.enemies];
    const enemy = enemies[index];
    if (enemy) {
      const newX = Math.min(Math.max(enemy.x + deltaX * enemy.speed, -6.66), 100 - 6.66 * 2);
      const newY = Math.min(Math.max(enemy.y + deltaY * enemy.speed, -6.66), 100 - 6.66 * 2);
      
      enemy.x = Number(newX.toFixed(2));
      enemy.y = Number(newY.toFixed(2));
    }
    return { enemies };
  }),

  updateEnemyHp: (index: number, hp: number) => set((state) => {
    const enemies = [...state.enemies];
    const enemy = enemies[index];
    if (enemy) {
      enemy.hp = hp;
    }
    return { enemies };
  }),
}));

export default useEnemyStore;

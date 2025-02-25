import { create } from 'zustand';

export interface PlayerSword {
  x: number,
  y: number,
  angle: number,
  speed: number,
  size: number,
  texture: number,
  damage: number
}

interface PlayerState {
  type: number,
  x: number;
  y: number;
  speed: number;
  currentSpeedX: number;
  currentSpeedY: number;
  friction: number;
  hp: number;
  maxHp: number;
  animationKey: number;
  animationLength: number;
  moving: boolean;
  size: number,
  isDead: boolean,
  invulnerabilityTime: number,
  invulnerabilityTimeMax: number, // время неуязвимости после получения урона
  swords: PlayerSword[],
  move: (dx: number, dy: number) => void;
  moveSword: (index: number, x: number, y: number) => void;
  addSword: (newSword: PlayerSword) => void; 
  changeHp: (amount: number) => void;
  setSpeed: (newSpeed: number) => void;
  setFriction: (newFriction: number) => void;
  setCurrentSpeed: (newSpeedX: number, newSpeedY: number) => void;
  killPlayer: () => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  type: 6,
  x: 35,
  y: 35,
  speed: 0.85,
  currentSpeedX: 0,
  currentSpeedY: 0,
  friction: 0.95,
  hp: 90,
  maxHp: 100,
  animationKey: 0,
  animationLength: 5,
  moving: false,  
  size: 2.5,
  isDead: false,
  invulnerabilityTime: 0,
  invulnerabilityTimeMax: 300,
  swords: [],

  move: (dx, dy) => set((state) => {
    const newX = Math.min(Math.max(state.x + dx * state.speed, -6.66), 100 - 6.66 * 2);
    const newY = Math.min(Math.max(state.y + dy * state.speed, -6.66), 100 - 6.66 * 2);

    return {
      x: Number(newX.toFixed(2)),
      y: Number(newY.toFixed(2)),
    };
  }),

  moveSword: (index: number, x: number, y: number) => {
    const swords = usePlayerStore.getState().swords;
  
    swords[index].x = x;
    swords[index].y = y;
  
    usePlayerStore.setState({ swords });
  },

  addSword: (newSword: PlayerSword) => set((state) => {
    const updatedSwords = [...state.swords, newSword];
    return { swords: updatedSwords }; 
  }),

  changeHp: (amount) => {
    const { invulnerabilityTime, invulnerabilityTimeMax} = usePlayerStore.getState();
    if(invulnerabilityTime <= 0){
      set((state) => ({
        hp: state.hp + amount,
        invulnerabilityTime: invulnerabilityTimeMax,
      }))
    }
  },

  setSpeed: (newSpeed) => set({ speed: newSpeed }),

  setFriction: (newFriction) => set({ friction: newFriction }),

  setCurrentSpeed: (newSpeedX, newSpeedY) => set({
    currentSpeedX: newSpeedX,
    currentSpeedY: newSpeedY,
  }),

  killPlayer: () => set({
    isDead: true,
  })
}));

export default usePlayerStore;

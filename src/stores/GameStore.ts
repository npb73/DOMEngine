import { create } from 'zustand';
import usePlayerStore from './PlayerStore';
import useEnemyStore from './EnemiesStore';
import useKeyStore from './KeyStore';
import { PlayerSword } from './PlayerStore';
import { Enemy } from './EnemiesStore';

interface GameState {
  isRunning: boolean;
  startGame: () => void;
  stopGame: () => void;
  update: () => void;
  updateEnemies: () => void;
  updateSwords: () => void;
  checkCollisionWithSword: (enemy: Enemy, sword: PlayerSword, playerX: number, playerY: number) => void;
  tick: number;
}

const calculateSpeed = (
  currentSpeed: number,
  targetSpeed: number,
  acceleration: number,
  friction: number,
  hasInput: boolean
): number => {
  if (hasInput) {
    return currentSpeed + (targetSpeed - currentSpeed) * acceleration;
  } else {
    return currentSpeed * friction;
  }
};

const normalizeDirection = (dx: number, dy: number): { dx: number, dy: number } => {
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  if (magnitude > 0) {
    return { dx: dx / magnitude, dy: dy / magnitude };
  }
  return { dx, dy };
};

const useGameStore = create<GameState>((set) => ({
  isRunning: true,
  tick: 0,

  startGame: () => {
    set({ isRunning: true });
    gameLoop();
  },

  stopGame: () => {
    set({ isRunning: false });
  },

  checkCollisionWithSword: (enemy: Enemy, sword: PlayerSword, playerX: number, playerY: number) => {
    const swordX = sword.x;
    const swordY = sword.y;
    const enemyRadius = enemy.size*2;
  
    const doesSegmentIntersectCircle = (
      x1: number, y1: number, x2: number, y2: number, xc: number, yc: number, R: number
    ): boolean => {
      const dx = x2 - x1;
      const dy = y2 - y1;

      const a = dx * dx + dy * dy;
      const b = 2 * (dx * (x1 - xc) + dy * (y1 - yc));
      const c = (x1 - xc) * (x1 - xc) + (y1 - yc) * (y1 - yc) - R * R;
    
      const discriminant = b * b - 4 * a * c;
    
      if (discriminant < 0) {
        return false;  
      } else {
        const sqrtDiscriminant = Math.sqrt(discriminant);
    
        const t1 = (-b - sqrtDiscriminant) / (2 * a);
        const t2 = (-b + sqrtDiscriminant) / (2 * a);
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
      }
    };
  
    const intersects = doesSegmentIntersectCircle(
      playerX, playerY, swordX, swordY, enemy.x, enemy.y, enemyRadius
    );
  
    if (intersects) {
      enemy.hp -= sword.damage; 
    }
  },

  updateEnemies: () => {
    const { enemies, moveEnemy, removeEnemy } = useEnemyStore.getState();
    const { x: playerX, y: playerY, size: playerSize, changeHp, swords } = usePlayerStore.getState(); 
    const { checkCollisionWithSword } = useGameStore.getState(); 

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
  
      for (let j = 0; j < swords.length; j++) {
        const sword = swords[j];
  
        checkCollisionWithSword(enemy, sword, playerX, playerY);
        
        if(enemy.hp <= 0){
          removeEnemy(enemy.id);
          break;
        }
      }

      
    }

    const eyes = enemies.filter((enemy) => enemy.type === 'eye')

    for (let i = 0; i < eyes.length; i++) {
      const enemy = enemies[i];

      const dx = playerX - enemy.x;  
      const dy = playerY - enemy.y;
  
      const { dx: normalizedDx, dy: normalizedDy } = normalizeDirection(dx, dy); 

      const enemySpeedX = normalizedDx * enemy.speed;
      const enemySpeedY = normalizedDy * enemy.speed;

      moveEnemy(i, enemySpeedX, enemySpeedY);

      const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
      const combinedSize = playerSize + enemy.size;  
      if (distanceToPlayer <= combinedSize) {
        changeHp(-enemy.damage)
      }
    }
  },

  updateSwords: () => {
    const { swords, moveSword } = usePlayerStore.getState(); 
    const { x: playerX, y: playerY } = usePlayerStore.getState();
  
    for (let i = 0; i < swords.length; i++) {
      const sword = swords[i];
  
      sword.angle += sword.speed; 

      if (sword.angle >= 360) {
        sword.angle -= 360;
      }
  
      sword.x = playerX + Math.cos(sword.angle * (Math.PI / 180)) * sword.size;
      sword.y = playerY + Math.sin(sword.angle * (Math.PI / 180)) * sword.size;

      moveSword(i, sword.x, sword.y);
    }
  },

  update: () => {
    const pressedKeys = useKeyStore.getState().pressedKeys;
    const { 
      move,
      speed,
      friction,
      currentSpeedX,
      currentSpeedY,
      animationKey,
      animationLength,
      hp,
      killPlayer,
      invulnerabilityTime
    } = usePlayerStore.getState();

    usePlayerStore.setState({invulnerabilityTime: invulnerabilityTime - 1})
    const { stopGame, updateSwords } = useGameStore.getState();

    updateSwords();

    if(hp <= 0){
      stopGame();
      killPlayer()
    }

    let dx = 0;
    let dy = 0;

    if (pressedKeys.has('ArrowUp') || pressedKeys.has('KeyW')) dy = -1;
    if (pressedKeys.has('ArrowDown') || pressedKeys.has('KeyS')) dy = 1;
    if (pressedKeys.has('ArrowLeft') || pressedKeys.has('KeyA')) dx = -1;
    if (pressedKeys.has('ArrowRight') || pressedKeys.has('KeyD')) dx = 1;

    const { dx: normalizedDx, dy: normalizedDy } = normalizeDirection(dx, dy);

    const targetSpeedX = normalizedDx * speed;
    const targetSpeedY = normalizedDy * speed;

    const newSpeedX = calculateSpeed(currentSpeedX, targetSpeedX, 0.1, friction, dx !== 0 || dy !== 0);
    const newSpeedY = calculateSpeed(currentSpeedY, targetSpeedY, 0.1, friction, dx !== 0 || dy !== 0);


    const currentTick = useGameStore.getState().tick;
    const frameRate = 6

    if(Math.abs(currentSpeedX) > 0.2 || Math.abs(currentSpeedY) > 0.2){
      if(currentTick % frameRate == 0){
        const newKey = animationKey+1
  
        if(newKey >= animationLength){
          usePlayerStore.setState({animationKey: 0})
  
        } else {
          usePlayerStore.setState({animationKey: newKey})
  
        }
      }
    }
    
    if(Math.abs(newSpeedX) > 0.001 || Math.abs(newSpeedY) > 0.001){
      usePlayerStore.setState({ currentSpeedX: newSpeedX, currentSpeedY: newSpeedY });
      move(newSpeedX, newSpeedY);
    } else {
      move(0, 0);
      usePlayerStore.setState({animationKey: 0})
    }
  },
}));

const gameLoop = () => {
  const { isRunning, update, tick, updateEnemies } = useGameStore.getState();

  if (isRunning) {
    update();
    requestAnimationFrame(gameLoop);
    if(tick%2 == 0){
      updateEnemies();
    }
    useGameStore.setState({tick: tick+1})
  }
};

export { useGameStore };

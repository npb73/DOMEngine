import React, { ReactNode } from 'react';
import styles from './Area.module.scss';
import usePlayerStore from '../../stores/PlayerStore';
interface AreaProps {
  children: ReactNode; 
}

const Area: React.FC<AreaProps> = ({ children }) => {
  const { isDead, invulnerabilityTime} = usePlayerStore();
  return (
    <div 
      className={
        `
        ${styles.area_main_container}
        ${
          isDead && 
          styles.dead_animation
        }
        ${
          invulnerabilityTime > 0 
          &&
          !isDead 
          &&
          styles.damage_animation
        }
        `
      }
    >
      {children}
    </div>
  );
}

export default Area;

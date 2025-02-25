import React, { useEffect, useCallback } from "react";
import useEnemyStore from "../../stores/EnemiesStore";
import styles from "./Enemy.module.scss";
import { useSeed } from "../../contexts/SeedContext";

const Enemy = React.memo(() => {
  const { rng } = useSeed();

  const rand = useCallback((min: number, max: number) => {
    return Math.floor(min + rng() * (max + 1 - min));
  }, [rng]);

  const { enemies, addEnemy } = useEnemyStore();

  useEffect(() => {
    for(let i = 0; i < 20; i++){
      addEnemy({
        x: rand(-200, 200),
        y: rand(-200, 200),
        type: "eye",
        speed: rand(1, 10)/10,
        hp: 100,
        maxHp: 100,
        animationKey: rand(0, 5),
        animationLength: 5,
        size: 2.5,
        damage: 35,
        id: rand(0, 99999999), // TODO unique key
      });
    }
    
    console.log(enemies.length)
  }, [addEnemy, rand]);

  return (
    <>
      {enemies.map((enemy) => (
        <div
          className={styles.enemy_container}
          style={{
            transform: `translate(${enemy.x * 5}%, ${enemy.y * 5}%)`,
          }}
          key={enemy.id}
        >
          <div
            className={`${styles.enemy} ${styles[enemy.type]}`}
            style={{
              backgroundPositionX: `calc(100% * ${enemy.animationKey * 8} + 1px)`,
            }}
          ></div>

          {/* <div className={styles.health_bar}>
            <div
              className={styles.health}
              style={{
                width: (enemy.hp / enemy.maxHp) * 100 + "%",
              }}
            ></div>
          </div> */}
        </div>
      ))}
    </>
  );
});

export default Enemy;

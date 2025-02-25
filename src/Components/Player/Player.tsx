import { useEffect } from "react";
import styles from "./Player.module.scss"
import usePlayerStore from "../../stores/PlayerStore";
import { useSeed } from "../../contexts/SeedContext";

function Player() {
  const { rng } = useSeed();
  const rand = (min: number, max: number) => Math.floor(min + rng() * (max + 1 - min));
  const {
    x, 
    y, 
    currentSpeedX, 
    animationKey, 
    hp, 
    maxHp, 
    isDead,
    invulnerabilityTime,
    swords,
    addSword,
    type,
  } = usePlayerStore();

  useEffect(() => {

    const SWORD_COUNT = rand(1, 9);

    for(let i = 0; i < SWORD_COUNT; i++){
      addSword({
        x: 0,
        y: 0,
        angle: 360/SWORD_COUNT*i,
        speed: rand(10, 40)/10,
        size: 16,
        texture: rand(0, 32),
        damage: 1000
      })
    }

  }, [])

  return (
    <div 
      className={styles.player_container}
      style={{
        transform: `translate(${x*5}%, ${y*5}%)`
      }}  
    >
      <div className={styles.health_bar}>
        <div 
          className={styles.health} 
          style={{
            width: ( hp / maxHp ) * 100 + '%'
          }}
        >
        </div>
      </div>

      {
        swords.map((el) => (
          <div
            className={styles.sword}
            style={{
              transform: `rotate(${el.angle + 90}deg)`,
              backgroundPositionX: `calc(100% * -${el.texture} - 2px)`
            }}
          >
          </div>
        ))
      }

      {/* {
      swords.map((el) => (
        <div
          className={styles.test_new_sword}
          style={{
            left: (el.x - x)*5 + '%',
            top: (el.y - y)*5 + '%'
          }}
        >

        </div>
      ))
      } */}

      <div 
        className={
          `
          ${styles.player}
          ${
            isDead &&
            styles.player_dead_animation
          }
          ${
            invulnerabilityTime > 0 && !isDead &&
            styles.invulnerability_animation
          }
          `
        }

        style={{
          opacity: invulnerabilityTime > 0 ? '0.5' : '1'
        }}
      >
        <div 
          className={
            `
            ${styles.player_body}
            `
          }
          style={{
            marginTop: animationKey > 1 && animationKey < 6 ? '-15%' : '0%',
            transform: `scaleX(${currentSpeedX > 0 ? -1 : 1})`,
            backgroundPositionX: `calc(100% * -${type})`,
          }}  
        >

        </div>
        <div 
          className={styles.player_legs}
          style={{
            transform: `scaleX(${currentSpeedX > 0 ? -1 : 1})`,
            backgroundPositionX: `calc(100% * -${animationKey})`
          }}  
        >
          
        </div>

        <div 
          className={styles.player_shadow}
        >
        </div>
      </div>
    </div>
  )
}

export default Player;

import styles from "./SlotMachine.module.scss"

function SlotMachine() {

  const slots_width = 5;
  // const slots_height = 5;

  function createArray(length: number): number[] {
    return new Array(length).fill(0);
  } 

  return (
    <div className={styles.slots_container}>
      {
        createArray(slots_width).map((_, index) => 
          <div 
            className={styles.slot}
            style={{
              animationDelay: index/10 + 's',
            }}
          >
            <div 
              className={styles.slot_animation_roll}
              style={{
                animationDelay: index/10 + 's',
              }}
            ></div>
          </div>
        )
      }
    </div>
  )
}

export default SlotMachine;

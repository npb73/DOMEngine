import { useEffect, useState } from 'react';
import Area from './Components/Area/Area'
import Player from './Components/Player/Player'
import { useGameStore } from './stores/GameStore'
import KeyboardHandler from './Components/KeyboardHandler/KeyboardHandler';
import Enemy from './Components/Enemy/Enemy';
import SlotMachine from './Components/SlotMachine/SlotMachine';

function App() {

  const { startGame, stopGame } = useGameStore();
  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.code == 'Space'){
        setShowSlots(true);
        stopGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    startGame();
  }, [])

  return (
    <section className="main_wrapper">
      <KeyboardHandler />
      <Area>
        <Enemy />
        <Player />
      </Area>
      {
        showSlots && 
        <SlotMachine />
      }
    </section>
  )
}

export default App

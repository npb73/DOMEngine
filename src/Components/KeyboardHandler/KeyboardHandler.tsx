import { useEffect } from 'react';
import useKeyStore from '../../stores/KeyStore';

const KeyboardHandler: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      useKeyStore.getState().addKey(event.code); // Добавляем код клавиши в состояние
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      useKeyStore.getState().removeKey(event.code); // Убираем код клавиши из состояния
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return null; // Этот компонент не рендерит ничего, он просто обрабатывает события
};

export default KeyboardHandler;

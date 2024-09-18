import { useEffect } from 'react';

const ARROW_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
];

export const useKeyPress = (handler: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: WindowEventMap['keydown']) => {
      if (ARROW_KEYS.includes(event.key)) {
        event.preventDefault();
      }
    };
    const handleKeyUp = (event: WindowEventMap['keyup']) => {
      if (ARROW_KEYS.includes(event.key)) {
        handler(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handler]);
};

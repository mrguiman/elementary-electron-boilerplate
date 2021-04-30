import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isMakingNoise, setIsMakingNoise] = useState(false);
  const [frequency, setFrequency] = useState<string | null>(null);

  const makeNoise = useCallback(() => {
    if (!isMakingNoise) {
      setIsMakingNoise(true);
      (window as any).electron.sendMessage({
        type: 'emit-sound',
        value: {
          gain: 1,
          frequency: 440
        }
      });
    }
  }, [isMakingNoise]);

  const stopNoise = useCallback(() => {
    if (isMakingNoise) {
      (window as any).electron.sendMessage({
        type: 'stop-sound'
      });
      setIsMakingNoise(false);
    }
  }, [isMakingNoise]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      switch (e.key) {
        case 'a':
          makeNoise();
          break;
      }
    }

    document.addEventListener('mouseup', stopNoise);
    document.addEventListener('keyup', stopNoise);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mouseup', stopNoise);
      document.removeEventListener('keyup', stopNoise);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [stopNoise, makeNoise]);

  useEffect(() => {
    (window as any).electron.onUpdate((e: unknown, messageData: any) => {
      if (messageData.type === 'update') {
        setFrequency(messageData.value.frequency);
      }
    });
  }, []);
  return (
    <div className="App">
      <h1>elementary-electron-typescript-react</h1>
      <p>{'Click on the following button or press "A" on your keyboard to emit a tone'}</p>
      <button onMouseDown={makeNoise}>Noise me !</button>
      <p id="tone">{frequency ? `${frequency}hz` : 'No Tone Playing'}</p>
    </div>
  );
}

export default App;

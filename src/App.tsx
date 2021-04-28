import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isMakingNoise, setIsMakingNoise] = useState(false);
  function makeNoise() {
    setIsMakingNoise(true);
    (window as any).electron.sendMessage({
      type: 'emit-sound'
    });
  }

  const stopNoise = useCallback(() => {
    if (isMakingNoise) {
      (window as any).electron.sendMessage({
        type: 'stop-sound'
      });
      setIsMakingNoise(false);
    }
  }, [isMakingNoise]);

  useEffect(() => {
    document.addEventListener('mouseup', stopNoise);
    return () => {
      document.removeEventListener('mouseup', stopNoise);
    };
  }, [stopNoise]);
  return (
    <div className="App">
      <h1>elementary-electron-typescript-react</h1>
      <p>{'Click on the following button or press "A" on your keyboard to emit a tone'}</p>
      <button onMouseDown={makeNoise}>Noise me !</button>
      <p id="tone">No Tone Playing</p>
    </div>
  );
}

export default App;

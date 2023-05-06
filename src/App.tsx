import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import Experience from './Experience/Experience';
function App() {
  const cansRef = useRef(null);
  useEffect(() => {
    if (cansRef.current) {
      const experience = new Experience(cansRef.current);
    }
  }, [])
  return (
    <canvas ref={cansRef} className='my-canvas'></canvas>
  )
}

export default App

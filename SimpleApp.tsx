import React, { useEffect } from 'react';

export default function SimpleApp() {
  useEffect(() => {
    console.log('SimpleApp component mounted');
  }, []);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontSize: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>
        <h1>StickerVerse</h1>
        <p>Simple App Component</p>
        <button 
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
          onClick={() => alert('Button clicked!')}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

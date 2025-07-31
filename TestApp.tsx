import React from 'react';

export default function TestApp() {
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
        <h1>StickerVerse Test App</h1>
        <p>If you can see this, React is working!</p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import FarcasterLogin from '../components/FarcasterLogin';

export default function Home() {
  // Add this to prevent hydration errors
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This only runs after component mounts (client-side)
    setIsClient(true);
  }, []);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Throwback Tunes
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Rediscover your favorite music from past decades
      </p>
      <div style={{ marginTop: '40px' }}>
        {isClient && <FarcasterLogin />}
      </div>
    </div>
  );
}
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
import Head from 'next/head';
import FarcasterLogin from '../components/FarcasterLogin';

export default function Home() {
  return (
    <>
      <Head>
        <title>Throwback Tunes</title>
        <meta name="description" content="Rediscover your favorite music from past decades" />
        
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://https://throwbacktunes.vercel.app/og-image.png" />
        <meta property="fc:frame:button:1" content="Get a Throwback Tune" />
        <meta property="fc:frame:post_url" content="https://https://throwbacktunes.vercel.app/api/frame" />
      </Head>
      
      {/* Your existing component content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Throwback Tunes</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Rediscover your favorite music from past decades</p>
        <div style={{ marginTop: '40px' }}>
          <FarcasterLogin />
        </div>
      </div>
    </>
  );
}
// pages/index.js
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Throwback Tunes</title>
        <meta name="description" content="Discover music from your favorite decades" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Throwback Tunes</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Welcome to Throwback Tunes! Share this link on Farcaster to get a random song recommendation.
        </p>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          marginTop: '30px' 
        }}>
          <h2>How to use:</h2>
          <p>
            1. Share this link on Farcaster<br />
            2. Click the "Get a Throwback Tune" button<br />
            3. Enjoy your recommendation!
          </p>
        </div>
      </div>
    </>
  );
}
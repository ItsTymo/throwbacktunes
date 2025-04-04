// pages/index.js
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
        <meta property="fc:frame:image" content="https://throwbacktunes.vercel.app/og-image.png" />
        <meta property="og:image" content="https://throwbacktunes.vercel.app/og-image.png" />
        <meta property="fc:frame:button:1" content="Get a Throwback Tune" />
        <meta property="fc:frame:post_url" content="https://throwbacktunes.vercel.app/api/frame" />
      </Head>
      
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
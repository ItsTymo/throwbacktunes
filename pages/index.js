// pages/index.js
import Head from 'next/head';
import FarcasterLogin from '../components/FarcasterLogin';

export default function Home() {
  return (
    <>
      <Head>
        <title>Throwback Tunes</title>
        <meta name="description" content="Rediscover your favorite music from past decades" />
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
// pages/_app.js
import { AuthKitProvider } from '@farcaster/auth-kit';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthKitProvider
      config={{
        domain: 'https://throwbacktunes.vercel.app/',
        // This URL should match your deployment URL
        rpcUrl: 'https://mainnet.optimism.io',
        siweUri: undefined,
      }}
    >
      <Component {...pageProps} />
    </AuthKitProvider>
  );
}

export default MyApp;
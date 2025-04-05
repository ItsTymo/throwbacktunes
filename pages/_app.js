// pages/_app.js
import { AuthKitProvider } from '@farcaster/auth-kit';
import { authKitConfig } from '../lib/FarcasterAuth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthKitProvider config={authKitConfig}>
      <Component {...pageProps} />
    </AuthKitProvider>
  );
}

export default MyApp;

import { AuthKitProvider } from '@farcaster/auth-kit';

// Configuration settings for Farcaster Auth
export const authKitConfig = {
  // Your deployed app domain
  domain: 'throwbacktunes.vercel.app',
  // Optimism's RPC URL - required for Farcaster auth
  rpcUrl: 'https://mainnet.optimism.io',
  // No siweUri needed for basic implementation
  siweUri: undefined,
};
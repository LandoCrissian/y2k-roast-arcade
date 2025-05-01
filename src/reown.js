import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { mainnet, solana } from '@reown/appkit/networks';
import { cronos } from 'viem/chains';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

const wagmiAdapter = new WagmiAdapter({
  projectId,
  metadata: {
    name: 'Y2K Roast Arcade',
    description: 'Multi-chain token gated game arcade',
    url: 'https://arcade.y2kcoin.org',
    icons: ['https://y2kcoin.org/favicon.ico']
  },
  chains: [mainnet, cronos]
});

const solanaAdapter = new SolanaAdapter();

export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: [mainnet, cronos, solana]
});

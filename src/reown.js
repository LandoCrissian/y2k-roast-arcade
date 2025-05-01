import { createAppKit } from '@reown/appkit';
import { wagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { solanaAdapter } from '@reown/appkit-adapter-solana';

export const appKit = createAppKit({
  projectId: "36c402e4989b8426f99d329788a526fc",
  wallets: [wagmiAdapter(), solanaAdapter()],
});

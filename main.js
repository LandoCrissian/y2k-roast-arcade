import { createAppKit, WagmiAdapter, SolanaAdapter } from "@reown/appkit";
import { createConfig } from "@wagmi/core";
import { mainnet } from "viem/chains";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { Connection, PublicKey } from "@solana/web3.js";

const wagmi = createConfig({
  connectors: [
    new WalletConnectConnector({
      chains: [mainnet],
      options: {
        projectId: "36c402e4989b8426f99d329788a526fc",
        showQrModal: true,
      },
    }),
  ],
});

const solana = new Connection("https://thrilling-old-sailboat.solana-mainnet.quiknode.pro/7eeaf93b8ff0a17a6172d1a57f8bf43c81d164a0");

const appkit = await createAppKit({
  adapters: [
    new WagmiAdapter({ wagmi }),
    new SolanaAdapter({ connection: solana }),
  ],
});

document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    const wallet = await appkit.connect();
    document.getElementById("status").innerText = "Wallet connected!";
    console.log("Connected wallet:", wallet);
  } catch (err) {
    console.error("WalletConnect Error:", err);
    document.getElementById("status").innerText = "WalletConnect error.";
  }
});
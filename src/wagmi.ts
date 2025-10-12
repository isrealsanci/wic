import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

const projectId = "d18d59aafb4364895f6e731472cd8931";

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true,
  connectors: [miniAppConnector()],
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: "Whats The Code?",
    description: "Crack the secret code in this thrilling game of logic and numbers. Choose your difficulty level, compete for points, and enjoy the challenge",
    url: "https://wtc.exapp.xyz.xyz",
    icons: ["https://wtc.exapp.xyz.xyz/lockcode-icon.png"],
  },
  features: {
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
    history: false,
    send: true,
  },
  themeMode: "dark",
});

export const config = wagmiAdapter.wagmiConfig;
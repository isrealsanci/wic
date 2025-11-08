require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config(); // Loads variables from .env

// Import variables from .env
const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // Config for local testing
    },
    base: {
      url: BASE_MAINNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 8453, // Chain ID for Base Mainnet
    },
  },
  // Etherscan configuration (for verification)
  etherscan: {
    apiKey: {
      // Define the API key for Base
      base: BASESCAN_API_KEY,
    },
    customChains: [
      {
        // Configuration for Base Mainnet
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api?chainid=8453",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
};
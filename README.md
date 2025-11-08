# 🎮 WIC Game – Web3 Interactive Code Challenge

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Base Mainnet](https://img.shields.io/badge/Base%20Mainnet-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FCC72B?style=for-the-badge&logo=ethereum&logoColor=black)
![Reown](https://img.shields.io/badge/Reown-4C51BF?style=for-the-badge&logo=walletconnect&logoColor=white)
![Farcaster](https://img.shields.io/badge/Farcaster-9A5AFF?style=for-the-badge&logo=farcaster&logoColor=white)
![Neon SQL](https://img.shields.io/badge/NeonSQL-008080?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🧠 Overview

**WIC Game** is a **Web3 interactive code guessing game** built using modern Web3 technologies such as:
- **Farcaster** for user identity (username & avatar)
- **Reown SDK** for wallet connection and authentication
- **Neon SQL** for storing leaderboard data
- **Hardhat** smart contract deployed on **Base Mainnet**

Players must guess a secret code within limited attempts depending on difficulty level.  
Challenge yourself, climb the leaderboard, and show your skills to the world! 🚀

---

## 🧩 Project Structure

```
wic-main/
│
├── frontend (src/)        # React + Vite + TypeScript + Tailwind
├── backend (functions/)   # Cloudflare Functions (API for leaderboard & results)
└── hardhat/               # Smart Contract (WICGAME.sol) for Base Mainnet
```

---

## 🎮 Frontend – React + Vite + TypeScript

### 🚀 Getting Started

```bash
git clone https://github.com/isrealsanci/wic.git
cd wic-main
npm install
npm run dev
```

Frontend will run on [http://localhost:5173](http://localhost:5173).

### ⚙️ Adjust Game Difficulty

You can configure game difficulty inside:
```
src/utils/gameConfig.ts
```

Example configuration:
```ts
export const DIFFICULTY_LEVELS = {
  easy: { maxAttempts: 8, codeLength: 3 },
  medium: { maxAttempts: 6, codeLength: 4 },
  hard: { maxAttempts: 4, codeLength: 5 },
};
```

Modify the values to make the game easier or more challenging.

### 🔑 Reown Configuration

Reown handles **wallet connection and user authentication**.

1. Get your API key from [Reown Dashboard](https://reown.io/)
2. Create a `.env` file in the project root:

```
VITE_REOWN_API_KEY=your_reown_api_key
VITE_APP_NAME="WIC Game"
```

3. Initialize Reown SDK in `src/wagmi.ts` or a similar configuration file.

---

## 🧭 Backend – Cloudflare Functions

Located at: `wic-main/functions/api`  
Contains two core API endpoints:
- `leaderboard.ts` → Fetch leaderboard data
- `submit-result.ts` → Submit game results and scores

### ⚙️ Setup & Run Locally

```bash
cd wic-main/functions
npm install
npm run dev
```

### 🔒 Environment Variables

Create a `.env` file inside `functions` folder:

```
DATABASE_URL=your_neon_sql_connection_string
API_KEY_SECRET=optional_secret_for_validation
```

### 🗄️ Database Configuration

WIC uses **NeonSQL (PostgreSQL cloud)** for storing leaderboard data.

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. Paste it into your `.env` as `DATABASE_URL`

### ☁️ Deploy to Cloudflare

Deploy backend easily using Cloudflare Workers:

```bash
npm run deploy
```

Make sure you're logged in to Cloudflare via `npx wrangler login` before deployment.

---

## ⚙️ Smart Contract – Hardhat on Base Mainnet

Located in: `wic-main/hardhat`  
Main contract file: `contracts/WICGAME.sol`

### 🧰 Setup & Compile

```bash
cd wic-main/hardhat
npm install
npx hardhat compile
```

### 🚀 Deploy to Base Mainnet

1. Duplicate `.env.example` as `.env`
2. Fill in the values below:

```
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://mainnet.base.org
ETHERSCAN_API_KEY=optional_for_verification
```

3. Run the deploy command:

```bash
npx hardhat run scripts/deploy.js --network base
```

### 📜 Verify Contract (Optional)

```bash
npx hardhat verify --network base <deployed_contract_address>
```

---

## 🌐 Deployment Summary

| Component | Platform | Command |
|------------|-----------|----------|
| Frontend | Cloudflare Pages | `npm run build` → deploy `dist/` folder |
| Backend | Cloudflare Workers | `npm run deploy` in `functions/` |
| Smart Contract | Base Mainnet | `npx hardhat run scripts/deploy.js --network base` |

---

## 🧰 Tech Stack

- ⚛️ React + Vite + TypeScript  
- 🎨 TailwindCSS  
- 🔑 Reown (Wallet Connect & Identity)  
- 💬 Farcaster (User Profile Integration)  
- ☁️ Cloudflare Workers (Serverless API)  
- 🪙 Base Mainnet + Hardhat  
- 🗄️ NeonSQL (Leaderboard Storage)

---

## 👨‍💻 Contributing

1. Fork this repository  
2. Clone your fork locally  
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
4. Commit & push your changes:
   ```bash
   git commit -m "add: your feature"
   git push origin feature/your-feature
   ```

---

## 💬 Credits

Developed with ❤️ using **React**, **Hardhat**, and **Cloudflare**.  
Powered by **Reown**, **Farcaster**, and **Base Network** to deliver a full Web3 gaming experience.

---

## 📜 License

MIT © 2025 — WIC Game by isrealsanci

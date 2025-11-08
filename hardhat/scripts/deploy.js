// Import necessary modules from hardhat
const { ethers, upgrades } = require("hardhat");

async function main() {
  // 1. Get the ContractFactory for our implementation contract.
  // This tells Hardhat how to build and deploy the WICGAME contract.
  const WICGAME = await ethers.getContractFactory("WICGAME");

  console.log("Deploying WICGAME (Transparent Proxy)...");

  // 2. Deploy the proxy.
  // This is the core function from the @openzeppelin/hardhat-upgrades plugin.
  // It automatically handles deploying:
  //    a) The ProxyAdmin contract (manages future upgrades)
  //    b) The WICGAME implementation contract (the logic)
  //    c) The Transparent Proxy contract (the one users interact with)
  const wicGameProxy = await upgrades.deployProxy(
    WICGAME, // The implementation contract factory
    [], // Arguments for the 'initialize' function (none in this case)
    {
      kind: "transparent", // Specify the transparent proxy pattern
      initializer: "initialize", // The name of the initializer function to call
    }
  );

  // 3. Wait for the deployment transaction to be confirmed on the network.
  await wicGameProxy.waitForDeployment();

  // 4. Get the address of the proxy contract.
  // This is the **main address** you will use in your DApp.
  const proxyAddress = await wicGameProxy.getAddress();
  console.log("WICGAME Proxy deployed to:", proxyAddress);

  // 5. Get the address of the implementation contract.
  // This is the address you need to **verify on Basescan**.
  // We use the 'erc1967' helper to read the implementation address from the proxy's storage.
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  
  console.log("Implementation address:", implementationAddress);
}

// A standard pattern for running async functions and handling errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// Connect.tsx


export function ConnectWallet() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-gray-900 text-white font-fredoka">
      <div className="text-center bg-black/40 backdrop-blur-lg p-10 rounded-2xl shadow-lg flex flex-col items-center border border-gray-700">
        <h1 className="text-5xl font-bold mb-4">Welcome in Game </h1>
        <p className="text-2xl mb-8">Please connect your wallet to continue.</p>
        <appkit-button />
      </div>
    </div>
  );
}
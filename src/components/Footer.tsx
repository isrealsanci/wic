import React from 'react';
import { User, Share2 } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";

const Footer: React.FC = () => {
  const handleManualShare = () => {
    sdk.actions.composeCast({
      text: "Crack the secret code in this thrilling game of logic and numbers. Choose your difficulty level, compete for points, and enjoy the challenge.",
      embeds: ["https://wtc.exapp.xyz"],
    });
  };

  return (
    <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Follow & Share
        </p>
        <div className="flex justify-center space-x-4 items-center">
          <a
            href="https://farcaster.xyz/return"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            aria-label="Farcaster Profile"
          >
            <User className="w-5 h-5" />
          </a>
          <button
            onClick={handleManualShare}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            aria-label="Share on Farcaster"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

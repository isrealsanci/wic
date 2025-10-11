import React from 'react';
import { User } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Follow us
        </p>
        <div className="flex justify-center space-x-4 items-center">
          <a
            href="https://farcaster.xyz/return" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <User className="w-5 h-5" /> 
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
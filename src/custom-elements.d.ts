// react-appkit-webcomponents.d.ts
import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        balance?: 'show' | 'hide';
        disabled?: boolean;
        size?: 'md' | 'sm';
        label?: string;
        loadingLabel?: string;
        namespace?: 'eip155' | 'solana' | 'bip122';
      };
      // You can also add other AppKit components:
      'appkit-account-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        balance?: 'show' | 'hide';
        disabled?: boolean;
      };
      'appkit-connect-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: 'md' | 'sm';
        label?: string;
        loadingLabel?: string;
      };
      'appkit-network-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        disabled?: boolean;
      };
      'appkit-wallet-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        wallet?: string;
        namespace?: 'eip155' | 'solana' | 'bip122';
      };
      // Add more if needed.
    }
  }
}

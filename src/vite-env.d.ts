/// <reference types="vite/client" />

declare global {
  interface Window {
    ribbit?: {
      type: 'app' | 'extension';
      postMessage: (event: string, payload?: unknown) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      off?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
export {};

declare global {
  interface Window {
    resetTour?: () => void;
  }
}
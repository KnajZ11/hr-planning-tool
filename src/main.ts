// src/main.ts
import { App } from './components/App';

declare global {
  interface Window {
    app: App;
  }
}

document.addEventListener('DOMContentLoaded', () => {  
  const app = new App(); 
  (window as any).app = app;
})
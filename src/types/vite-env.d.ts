/// <reference types="vite/client" />

// Extensión de tipos para variables de entorno
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_WEBSOCKET_URL: string;
  // más variables de entorno aquí según se necesiten
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

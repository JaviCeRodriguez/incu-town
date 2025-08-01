# 🔧 Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno para el proyecto Incu Town.

## 📋 Variables Disponibles

### `VITE_DEBUG`

Controla la visualización de herramientas de debugging en el juego.

- **Valores válidos**: `"1"`, `"true"` (habilitado) o `"0"`, `"false"` (deshabilitado)
- **Por defecto**: deshabilitado si no se define

**Cuando está habilitado muestra:**

- Hitbox del jugador (línea roja punteada)
- Indicador de tile actual (cuadro amarillo)
- Información de colisiones en la consola del navegador
- Panel de debug en la UI del juego

### `VITE_APP_TITLE`

Título de la aplicación mostrado en el navegador.

- **Ejemplo**: `"Incu Town (Dev)"` o `"Incu Town"`

### `VITE_WEBSOCKET_URL`

URL del servidor WebSocket para multijugador (para futuras implementaciones).

- **Ejemplo**: `"ws://localhost:3001"` (desarrollo) o `"wss://api.incutown.com"` (producción)

## 🚀 Configuración

### 1. Crear archivo de variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
VITE_DEBUG=1
VITE_APP_TITLE=Incu Town (Dev)
VITE_WEBSOCKET_URL=ws://localhost:3001
```

### 2. Para diferentes entornos

#### Desarrollo con debug:

```bash
# .env.local
VITE_DEBUG=1
VITE_APP_TITLE=Incu Town (Dev)
```

#### Producción sin debug:

```bash
# .env.production
VITE_DEBUG=0
VITE_APP_TITLE=Incu Town
```

### 3. Verificar configuración

En el panel de debug del juego verás:

```
🐛 Modo Debug: VITE_DEBUG=1
```

## 🔒 Seguridad

- **IMPORTANTE**: Solo las variables con prefijo `VITE_` son accesibles desde el frontend
- **NO agregues**: claves de API, tokens secretos o información sensible
- El archivo `.env.local` debe estar en `.gitignore` (ya configurado)

## 🛠️ Uso en Código

### Verificar si debug está habilitado:

```typescript
import { isDebugEnabled } from "./utils/debug";

if (isDebugEnabled()) {
  // Código solo para debug
}
```

### Logging condicional:

```typescript
import { debugLog } from "./utils/debug";

debugLog("Este mensaje solo aparece en modo debug");
```

## 📝 Ejemplos de archivos

### `.env.local` (desarrollo)

```bash
VITE_DEBUG=1
VITE_APP_TITLE=Incu Town (Dev)
VITE_WEBSOCKET_URL=ws://localhost:3001
```

### `.env.production` (producción)

```bash
VITE_DEBUG=0
VITE_APP_TITLE=Incu Town
VITE_WEBSOCKET_URL=wss://api.incutown.com
```

## 🔄 Cambios en Tiempo Real

- Los cambios en variables de entorno **requieren reiniciar** el servidor de desarrollo
- Ejecuta `pnpm run dev` después de modificar `.env.local`

## ❓ Troubleshooting

### Variable no se lee

1. Verifica que tenga el prefijo `VITE_`
2. Reinicia el servidor de desarrollo
3. Revisa que el archivo `.env.local` esté en la raíz del proyecto

### Debug no aparece

1. Verifica que `VITE_DEBUG=1` en `.env.local`
2. Abre la consola del navegador para ver logs
3. Revisa que el componente `CollisionDebug` tenga `enabled={true}`

# 🎵 Sistema de Audio por Proximidad

El sistema de audio por proximidad permite que los jugadores se escuchen entre sí basándose en su distancia en el mapa, similar a Gather Town.

## 🎯 Funcionalidades Implementadas

### 📊 **Rangos de Proximidad**

| Distancia       | Volumen | Color Debug | Descripción                          |
| --------------- | ------- | ----------- | ------------------------------------ |
| 1 tile (32px)   | 100%    | 🟢 Verde    | Audio máximo - muy cerca             |
| 3 tiles (96px)  | 50%     | 🟠 Naranja  | Audio medio - referencia del usuario |
| 6 tiles (192px) | 0-10%   | 🔴 Rojo     | Límite de audio audible              |
| 5 tiles (160px) | -       | 🔵 Azul     | Rango para aparecer en Discord       |

### 🎙️ **Sidebar de Voz Estilo Discord**

- **Posición**: Sidebar fijo en el lado derecho de la pantalla
- **Funcionalidad**: Muestra jugadores en rango audible + tu propio micrófono
- **Información mostrada**:
  - Avatar con inicial del nombre
  - Nombre del jugador
  - **Badge "Tú"** para tu propio jugador
  - **Borde verde pulsante** en avatar cuando hablas
  - Indicador de "hablando" (simulado)
  - Barra de volumen visual (verde cuando hablas)
  - Porcentaje de volumen numérico / "Mic" o "🎤 Hablando" para ti
  - Distancia en píxeles (modo debug)
  - **Icono de micrófono** 🎤 para tu entrada

### 🔊 **Cálculo de Volumen**

El volumen se calcula usando interpolación lineal:

```typescript
// Pseudocódigo del cálculo
if (distance <= MIN_DISTANCE) {
  volume = 100%;
} else if (distance <= MAX_DISTANCE) {
  volume = 100% - ((distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100%;
} else {
  volume = 0%;
}
```

## 🎮 **Experiencia de Usuario**

### 👂 **Como Jugador**

1. **Muévete cerca de otros jugadores** para escucharlos mejor
2. **Consulta el sidebar de voz** (lado derecho) para ver quién está hablando
3. **Observa tu propio micrófono** en la parte superior del sidebar (con badge "Tú")
4. **Observa el borde verde** en tu avatar cuando estés "hablando"
5. **Observa las barras de volumen** para entender el nivel de audio
6. **Alejándote** los jugadores desaparecen del sidebar
7. **Tu entrada siempre está visible** para monitorear tu micrófono

### 🐛 **En Modo Debug** (VITE_DEBUG=1)

- **Círculos de proximidad** visibles alrededor de tu jugador
- **Líneas de conexión** hacia jugadores audibles
- **Porcentajes de volumen** y distancias en píxeles
- **Información detallada** en el panel de debug

## 🏗️ **Arquitectura Técnica**

### 📁 **Archivos Principales**

```
src/
├── utils/
│   └── proximitySystem.ts      # Lógica de cálculo de proximidad
├── components/
│   ├── VoiceChat.tsx          # Lista estilo Discord
│   ├── VoiceChat.css          # Estilos del componente
│   └── ProximityDebug.tsx     # Debug visual de rangos
└── types/
    └── game.ts                # Tipos de proximidad
```

### 🔧 **Configuración**

La configuración está en `PROXIMITY_CONFIG`:

```typescript
export const PROXIMITY_CONFIG = {
  MAX_AUDIO_DISTANCE: TILE_SIZE * 6, // 6 tiles máximo
  HALF_VOLUME_DISTANCE: TILE_SIZE * 3, // 3 tiles = 50%
  MIN_DISTANCE_FULL_VOLUME: TILE_SIZE * 1, // 1 tile = 100%
  DISCORD_LIST_DISTANCE: TILE_SIZE * 5, // Rango Discord
};
```

### 🎲 **Detección de "Hablando"**

Sistema híbrido de detección de voz:

- **🎤 Micrófono real** para tu propio jugador (Web Audio API)
- **🎭 Simulación** para otros jugadores (30% probabilidad)
- **🔄 Análisis en tiempo real** del audio de tu micrófono
- **📊 Umbral configurable** para detectar voz (0.1 por defecto)
- **🎯 Borde verde pulsante** en tu avatar cuando hablas realmente
- **📈 Volumen real** mostrado en la barra de progreso
- **✅ Indicadores de estado** del micrófono (escuchando/error)
- **🐛 Logs de debug** cuando hablas con nivel de volumen

## 🔮 **Futuras Implementaciones**

### 🏢 **Zonas de Oficina** (Preparado)

- **Audio al 100%** sin importar distancia dentro de la zona
- **Detección automática** cuando el jugador entra/sale
- **Configuración por zona** en archivos JSON

### 🎙️ **Audio Real** (Parcialmente Implementado)

- **✅ Detección de micrófono real** usando Web Audio API
- **✅ Análisis de volumen en tiempo real**
- **✅ Indicadores visuales de estado del micrófono**
- **🔄 Push-to-talk** con tecla configurable (pendiente)
- **🔄 Control de volumen** individual por jugador (pendiente)
- **🔄 Mute/unmute** personal (pendiente)
- **🔄 WebRTC** para transmisión de audio (pendiente)

### 🎨 **Mejoras Visuales** (Pendiente)

- **Globos de diálogo** sobre jugadores hablando
- **Ondas de sonido** animadas
- **Indicadores direccionales** de audio

## 🛠️ **Configuración del Desarrollador**

### 🐛 **Habilitar Debug**

```bash
# En .env.local
VITE_DEBUG=1
```

### 🎯 **Testing**

```bash
# Ejecutar con debug
pnpm run dev:debug

# Verificar en navegador:
# 1. Lista Discord aparece con jugadores cercanos
# 2. Círculos de proximidad visibles
# 3. Porcentajes de volumen cambian al moverse
```

### 📝 **Logs de Debug**

Con debug habilitado, verás en consola:

```
[DEBUG] CollisionSystem initialized
[DEBUG] Proximity calculated { distance: 96, audioVolume: 0.5, ... }
```

## 🎨 **Personalización**

### 🎨 **Colores de Volumen**

```css
/* En VoiceChat.css */
--volume-high: #2ecc71; /* Verde - 80%+ */
--volume-mid: #f39c12; /* Naranja - 50%+ */
--volume-low: #e74c3c; /* Rojo - 10%+ */
--volume-mute: #95a5a6; /* Gris - 0% */
```

### 📏 **Ajustar Distancias**

```typescript
// En proximitySystem.ts
export const PROXIMITY_CONFIG = {
  MAX_AUDIO_DISTANCE: TILE_SIZE * 8, // Más lejos
  HALF_VOLUME_DISTANCE: TILE_SIZE * 4, // Más generoso
  // ...
};
```

## 📊 **Métricas y Análisis**

### 🎯 **Datos Disponibles**

- **Distancia entre jugadores** en píxeles
- **Volumen calculado** (0.0 - 1.0)
- **Estado de proximidad** (audible/inaudible)
- **Jugadores en rango Discord** vs total

### 📈 **Para Análisis Futuro**

- **Tiempo de proximidad** entre jugadores
- **Patrones de movimiento** social
- **Uso de zonas** del mapa
- **Interacciones por proximidad**

---

## 🎉 **¡El sistema está funcionando!**

Muévete por el mapa y observa cómo:

- 📋 **El sidebar de voz** se actualiza dinámicamente
- 🎤 **Tu micrófono real** detecta cuando hablas
- 🔊 **Los volúmenes cambian** según la distancia
- 🎯 **El borde verde** aparece cuando hablas realmente
- 📊 **El volumen real** se muestra en la barra de progreso
- 🐛 **El debug** revela toda la mecánica interna

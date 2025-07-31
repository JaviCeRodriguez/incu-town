# Incu Town 🏘️

Un mundo virtual multijugador similar a Gather Town, construido con React y tecnologías web modernas.

## 🚀 Características

- **Mundo Virtual 2D**: Navega por un entorno virtual en tiempo real
- **Movimiento Fluido**: Controles intuitivos con teclado (WASD / Flechas)
- **Salas Multiplayer**: Crea o únete a salas privadas con amigos
- **Interfaz Moderna**: UI responsive y atractiva
- **Arquitectura Escalable**: Base sólida para agregar más funcionalidades

## 🛠️ Tecnologías Utilizadas

- **React** - Framework de UI
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de desarrollo rápida
- **Konva.js** - Renderizado de gráficos 2D de alto rendimiento
- **React-Konva** - Wrapper de React para Konva
- **Zustand** - Gestión de estado ligera
- **Socket.io** - Comunicación en tiempo real (preparado para futuras versiones)
- **pnpm** - Gestor de paquetes rápido y eficiente

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd incu-town
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🎮 Cómo Jugar

1. **Página de Inicio**: Ingresa tu nombre y opcionalmente un ID de sala
2. **Unirse al Juego**: Haz clic en "Unirse al Juego" o "Crear Nueva Sala"
3. **Movimiento**: Usa las teclas WASD o las flechas del teclado para moverte
4. **Interacción**: Explora el mundo virtual y ve la información del jugador en tiempo real

## 🏗️ Estructura del Proyecto

```
src/
├── types/               # Definiciones de tipos TypeScript
│   ├── game.ts          # Tipos principales del juego
│   └── vite-env.d.ts    # Tipos de entorno de Vite
├── components/          # Componentes de React reutilizables
│   ├── GameCanvas.tsx   # Canvas principal del juego
│   ├── Player.tsx       # Componente del jugador
│   └── World.tsx        # Componente del mundo/mapa
├── pages/               # Páginas principales
│   ├── HomePage.tsx     # Página de inicio
│   └── GamePage.tsx     # Página del juego
├── store/               # Gestión de estado con Zustand
│   └── gameStore.ts     # Store principal del juego
├── hooks/               # Custom hooks
│   ├── useKeyboard.ts   # Manejo de teclado
│   └── useGameLoop.ts   # Loop principal del juego
├── constants/           # Constantes del juego
│   └── gameConstants.ts # Configuración y constantes
└── utils/               # Utilidades (para futuras expansiones)
```

## 🎯 Próximas Funcionalidades

- [ ] **Multijugador en Tiempo Real**: Integración completa con Socket.io
- [ ] **Sistema de Chat**: Comunicación entre jugadores
- [ ] **Avatares Personalizables**: Diferentes estilos de personajes
- [ ] **Áreas de Interacción**: Zonas especiales con funcionalidades
- [ ] **Audio Espacial**: Audio posicional según la proximidad
- [ ] **Persistencia**: Guardado de posiciones y preferencias
- [ ] **Minijuegos**: Actividades interactivas dentro del mundo
- [ ] **Sistema de Amigos**: Lista de contactos y invitaciones

## 🛠️ Scripts Disponibles

- `pnpm run dev` - Inicia el servidor de desarrollo
- `pnpm run build` - Construye la aplicación para producción
- `pnpm run preview` - Previsualiza la build de producción
- `pnpm run lint` - Ejecuta el linter de código

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto:

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎨 Personalización

El juego está diseñado para ser fácilmente personalizable:

- **Colores**: Modifica `GAME_CONFIG.COLORS` en `gameConstants.js`
- **Dimensiones**: Ajusta el tamaño del canvas y tiles en las constantes
- **Velocidad**: Cambia `PLAYER_SPEED` para un movimiento más rápido/lento
- **Mapas**: Modifica la función `createBasicMap()` en `World.jsx` para crear nuevos diseños

¡Diviértete explorando y construyendo sobre esta base! 🚀

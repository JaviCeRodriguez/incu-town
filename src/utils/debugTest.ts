// Script de prueba para el sistema de debug
import {
  isDebugEnabled,
  debugLog,
  debugWarn,
  debugError,
  debugOnly,
} from "./debug";

export const runDebugTests = () => {
  console.log("🧪 Ejecutando tests del sistema de debug...");
  console.log("🐛 Debug habilitado:", isDebugEnabled());
  console.log("🔧 VITE_DEBUG:", import.meta.env.VITE_DEBUG);

  // Test de logs condicionales
  debugLog("✅ debugLog funciona correctamente");
  debugWarn("⚠️ debugWarn funciona correctamente");
  debugError("❌ debugError funciona correctamente");

  // Test de ejecución condicional
  debugOnly(() => {
    console.log("🎯 debugOnly ejecutado correctamente");
  });

  // Test con datos complejos
  debugLog("📊 Test con objeto:", {
    position: { x: 100, y: 200 },
    config: { debug: isDebugEnabled(), timestamp: Date.now() },
  });

  console.log("✅ Tests de debug completados");
};

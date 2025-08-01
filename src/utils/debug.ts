// Utilidades para debugging

/**
 * Verifica si el modo debug está habilitado
 * @returns {boolean} true si DEBUG está habilitado, false en caso contrario
 */
export const isDebugEnabled = (): boolean => {
  const debugEnv = import.meta.env.VITE_DEBUG;
  return debugEnv === "1" || debugEnv === "true";
};

/**
 * Log de debug que solo se muestra si el debug está habilitado
 * @param {...any} args - Argumentos a loggear
 */
export const debugLog = (...args: any[]): void => {
  if (isDebugEnabled()) {
    console.log("[DEBUG]", ...args);
  }
};

/**
 * Warning de debug que solo se muestra si el debug está habilitado
 * @param {...any} args - Argumentos a loggear
 */
export const debugWarn = (...args: any[]): void => {
  if (isDebugEnabled()) {
    console.warn("[DEBUG]", ...args);
  }
};

/**
 * Error de debug que solo se muestra si el debug está habilitado
 * @param {...any} args - Argumentos a loggear
 */
export const debugError = (...args: any[]): void => {
  if (isDebugEnabled()) {
    console.error("[DEBUG]", ...args);
  }
};

/**
 * Ejecuta una función solo si el debug está habilitado
 * @param {Function} fn - Función a ejecutar
 */
export const debugOnly = (fn: () => void): void => {
  if (isDebugEnabled()) {
    fn();
  }
};

/**
 * Hook de React para usar el estado de debug
 * @returns {boolean} Estado actual del debug
 */
export const useDebug = (): boolean => {
  return isDebugEnabled();
};

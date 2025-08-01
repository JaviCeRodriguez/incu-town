import { useState, useEffect, useRef } from "react";
import { debugLog, debugWarn, debugError } from "../utils/debug";

interface MicrophoneState {
  isListening: boolean;
  isTalking: boolean;
  volume: number;
  hasPermission: boolean;
  error: string | null;
}

export const useMicrophone = () => {
  const [state, setState] = useState<MicrophoneState>({
    isListening: false,
    isTalking: false,
    volume: 0,
    hasPermission: false,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Configuración de detección de voz
  const VOICE_THRESHOLD = 0.1; // Umbral para detectar voz (0-1)
  const TALKING_DURATION = 500; // Milisegundos para considerar que está hablando
  const VOLUME_SMOOTHING = 0.3; // Suavizado del volumen (0-1)

  const startListening = async () => {
    try {
      debugLog("🎤 Iniciando detección de micrófono...");

      // Crear contexto de audio
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Crear nodos de audio
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();

      // Configurar analizador
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = VOLUME_SMOOTHING;

      // Conectar nodos
      source.connect(analyser);

      // Guardar referencias
      microphoneRef.current = source;
      analyserRef.current = analyser;

      setState((prev) => ({
        ...prev,
        isListening: true,
        hasPermission: true,
        error: null,
      }));

      debugLog("✅ Micrófono iniciado correctamente");

      // Iniciar análisis de audio
      analyzeAudio();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      debugError("❌ Error al iniciar micrófono:", errorMessage);

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
      }));
    }
  };

  const stopListening = () => {
    debugLog("🛑 Deteniendo micrófono...");

    // Cancelar animación
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Detener stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Limpiar contexto de audio
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Limpiar referencias
    microphoneRef.current = null;
    analyserRef.current = null;

    setState((prev) => ({
      ...prev,
      isListening: false,
      isTalking: false,
      volume: 0,
    }));

    debugLog("✅ Micrófono detenido");
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    // Calcular volumen promedio
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const normalizedVolume = average / 255; // Normalizar a 0-1

    // Detectar si está hablando
    const isTalking = normalizedVolume > VOICE_THRESHOLD;

    setState((prev) => ({
      ...prev,
      volume: normalizedVolume,
      isTalking,
    }));

    // Continuar análisis
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Iniciar automáticamente al montar el componente
  useEffect(() => {
    startListening();

    // Limpiar al desmontar
    return () => {
      stopListening();
    };
  }, []);

  // Logs de debug cuando cambia el estado
  useEffect(() => {
    if (state.isTalking) {
      debugLog("🎤 Usuario hablando", {
        volume: Math.round(state.volume * 100),
      });
    }
  }, [state.isTalking, state.volume]);

  return {
    ...state,
    startListening,
    stopListening,
  };
};

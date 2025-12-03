
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSpeechToText() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    setTranscript("");
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType =
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      // Some browsers (Safari) don't support passing an empty mimeType; fall back to default
      const options = mimeType ? ({ mimeType } as MediaRecorderOptions) : ({} as MediaRecorderOptions);
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mr.onerror = (e) => {
        console.error("MediaRecorder error", e);
        setError("Recording error. Please try again.");
        setIsRecording(false);
      };
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const arrayBuffer = await blob.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          const { data, error } = await supabase.functions.invoke("voice-to-text", {
            body: { audio: base64 },
          });
          if (error) {
            console.error("voice-to-text error", error);
            setError(error.message || "Transcription error");
          } else {
            setTranscript((data as any)?.text || "");
          }
        } catch (err: any) {
          console.error("Transcription exception", err);
          setError(err.message || "Transcription error");
        } finally {
          setIsRecording(false);
          try {
            stream.getTracks().forEach((t) => t.stop());
          } catch {}
        }
      };

      mediaRecorderRef.current = mr;
      mr.start(250);
      setIsRecording(true);
    } catch (err: any) {
      console.error("getUserMedia error", err);
      setError(err.message || "Microphone permission denied");
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      try {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      } catch {}
    }
  }, []);

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    reset: () => {
      setTranscript("");
      setError(null);
    },
  };
}

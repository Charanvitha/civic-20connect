import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Repeat, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCapture: (dataUrl: string) => void;
}

export default function CaptureCamera({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (!active) return;
        setStream(media);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error", err);
      }
    }
    init();
    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImagePreview(dataUrl);
    onCapture(dataUrl);
  }

  function flip() {
    setFacingMode((p) => (p === "user" ? "environment" : "user"));
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border bg-black">
        {imagePreview ? (
          // Preview captured image
          <img
            src={imagePreview}
            alt="Captured"
            className="w-full h-[360px] object-contain bg-black"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-[360px] object-cover"
            playsInline
            muted
          />
        )}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4">
          <Button
            onClick={flip}
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 backdrop-blur"
          >
            <Repeat /> Flip
          </Button>
          <Button
            onClick={capture}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="mr-2" /> Capture
          </Button>
          {imagePreview && (
            <Button
              onClick={() => setImagePreview(null)}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <CameraOff className="mr-2" /> Retake
            </Button>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        Snap a clear photo of the issue for faster resolution.
      </div>
    </div>
  );
}

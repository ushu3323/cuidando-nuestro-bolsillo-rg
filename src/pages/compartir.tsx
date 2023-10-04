import { useEffect, useRef, useState } from "react";

export default function CompartirPage() {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);

  async function getStream() {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      ...constraints,
    });
  }

  useEffect(() => {
    console.log("useEffect: Get stream");
    getStream()
      .then((stream) => setMediaStream(stream))
      .catch((error) => alert(error));
  }, []);

  useEffect(() => {
    console.log("useEffect setVideo");
    if (mediaStream) {
      const video = videoRef.current;
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        void video.play();
      };
    }
  }, [mediaStream]);

  return (
    <div className="prose prose-headings:text-white min-h-screen bg-zinc-900">
      <h1>Camara</h1>
      <div className="prose prose-headings:text-white">
        <video
          id="camera"
          autoPlay
          muted
          playsInline
          ref={videoRef}
          className="text-white"
        >
          No disponible
        </video>
        <canvas id="capture" style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
}

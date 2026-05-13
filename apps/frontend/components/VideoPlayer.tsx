'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  hlsUrl: string;
}

export default function VideoPlayer({ hlsUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    // Safari supports HLS natively — skip HLS.js entirely
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    let hls: import('hls.js').default | undefined;

    import('hls.js').then(({ default: Hls }) => {
      if (!Hls.isSupported()) return;

      hls = new Hls({
        // Keep buffer small — archive content, not live; avoids excess memory use
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    });

    return () => {
      hls?.destroy();
    };
  }, [hlsUrl]);

  return (
    <div className="w-full bg-black aspect-video overflow-hidden">
      <video
        ref={videoRef}
        controls
        playsInline
        className="w-full h-full block"
      />
    </div>
  );
}

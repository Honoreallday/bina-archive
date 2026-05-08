'use client';

import { useEffect, useRef } from 'react';

export default function VideoPlayer({ hlsUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    // Safari supports HLS natively — skip HLS.js entirely
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    let hls;

    import('hls.js').then(({ default: Hls }) => {
      if (!Hls.isSupported()) return;

      hls = new Hls({
        // Keep buffer small — this is an archive, not live; avoids excess memory use
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
    <div style={styles.wrapper}>
      <video
        ref={videoRef}
        controls
        style={styles.video}
        playsInline
      />
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: '4px',
    overflow: 'hidden',
    aspectRatio: '16 / 9',
  },
  video: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};

"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Gauge } from "lucide-react";

interface HeroVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function HeroVideoPlayer({
  src,
  poster = "/og.png",
  className = "hive-demo-video h-full w-full object-cover",
}: HeroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.5);
  const [showCenterFeedback, setShowCenterFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial 1.5x speed requested by user
    video.playbackRate = playbackRate;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    // Try auto-play
    video.play().catch(() => {
      // Autoplay with sound might be blocked or required user interaction
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  const triggerFeedback = () => {
    setShowCenterFeedback(true);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setShowCenterFeedback(false);
    }, 1200);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
    triggerFeedback();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    // If unmuting and video paused, ensure it continues playing
    if (!nextMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    // Toggle between 1.5x and 1x (or cycle 1x, 1.5x, 2x)
    const nextRate = playbackRate === 1.5 ? 1.0 : 1.5;
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  return (
    <div
      className="hero-video-container group"
      onClick={togglePlay}
      role="region"
      aria-label="Hive product video player"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className={className}
        aria-label="Hive product demo"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video.
      </video>

      {/* Top Right Glassmorphism Controls: Sound Toggle + Speed Toggle */}
      <div
        className="hero-video-top-controls"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Speed button */}
        <button
          type="button"
          onClick={toggleSpeed}
          className="hero-video-glass-pill"
          aria-label={`Current speed ${playbackRate}x. Click to switch.`}
          title={`Speed: ${playbackRate}x`}
        >
          <Gauge className="w-3.5 h-3.5 text-lime-400" />
          <span>{playbackRate}x</span>
        </button>

        {/* Audio Mute/Unmute button */}
        <button
          type="button"
          onClick={toggleMute}
          className="hero-video-glass-btn"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Turn sound on" : "Turn sound off"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/70 hover:text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-lime-400" />
          )}
          <span className="hero-video-btn-label">
            {isMuted ? "Sound Off" : "Sound On"}
          </span>
        </button>
      </div>

      {/* Center Glassmorphism Play / Pause Button */}
      <div
        className={`hero-video-center-overlay ${
          !isPlaying || showCenterFeedback ? "hero-video-center-visible" : "hero-video-center-auto-hide"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="hero-video-glass-play-btn"
          aria-label={isPlaying ? "Pause video" : "Resume video"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white fill-white/80" />
          ) : (
            <Play className="w-7 h-7 text-white fill-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

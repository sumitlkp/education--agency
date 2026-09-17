import React, { useState, useRef, useEffect } from 'react';
import { Lecture } from '../../types.ts';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface CoursePlayerProps {
  lecture: Lecture;
  courseTitle: string;
  isEnrolled: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onUpdateProgress: (lectureId: string, completed: boolean, timeSeconds: number) => void;
  onOpenEnrollModal: () => void;
  initialTimeSeconds?: number;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  lecture,
  courseTitle,
  isEnrolled,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onUpdateProgress,
  onOpenEnrollModal,
  initialTimeSeconds = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(initialTimeSeconds);
  const [duration, setDuration] = useState<number>(lecture.durationSeconds || 1800);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [settingsMenuOpen, setSettingsMenuOpen] = useState<'none' | 'main' | 'speed' | 'quality'>('none');
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const canPlay = lecture.isFreePreview || isEnrolled;

  // Filter only actually available qualities for this lecture!
  const availableQualities = lecture.availableQualities && lecture.availableQualities.length > 0
    ? lecture.availableQualities
    : ['360p', '480p', '720p'];

  useEffect(() => {
    // Make sure initial selected quality is in the available set
    if (!availableQualities.includes(selectedQuality as any)) {
      setSelectedQuality(availableQualities[availableQualities.length - 1]);
    }
  }, [lecture.id, availableQualities, selectedQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canPlay) return;

    if (initialTimeSeconds > 0) {
      video.currentTime = initialTimeSeconds;
    }
    video.playbackRate = playbackSpeed;
  }, [lecture.id, canPlay]);

  // Periodic progress saving
  useEffect(() => {
    if (!canPlay) return;
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        const curr = videoRef.current.currentTime;
        onUpdateProgress(lecture.id, curr > duration * 0.85, Math.floor(curr));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [lecture.id, isPlaying, duration, canPlay, onUpdateProgress]);

  const togglePlay = () => {
    if (!canPlay) {
      onOpenEnrollModal();
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
    if (newMute) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = volume || 0.8;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSettingsMenuOpen('none');
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    setSettingsMenuOpen('none');
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    onUpdateProgress(lecture.id, true, Math.floor(duration));
    if (hasNext) {
      onNext();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black select-none border border-slate-800 shadow-2xl group"
    >
      {/* Locked Overlay if not enrolled and not free preview */}
      {!canPlay ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Lecture Locked</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Please enroll in this course to access "{lecture.title}" along with complete batch notes and live doubt classes.
          </p>
          <button
            onClick={onOpenEnrollModal}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all"
          >
            Enroll in Batch to Unlock
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={lecture.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />
      )}

      {/* Floating Center Play Button on paused */}
      {canPlay && !isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 transition-transform">
            <Play className="w-9 h-9 fill-slate-950 translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Banner on Hover: Lecture info */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300 flex items-center justify-between text-xs text-white ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="truncate pr-4">
          <span className="text-amber-400 font-semibold">{courseTitle}</span>
          <span className="text-slate-400 mx-2">•</span>
          <span className="font-medium text-slate-100">{lecture.title}</span>
        </div>

        {lecture.isFreePreview && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase shrink-0">
            Free Preview
          </span>
        )}
      </div>

      {/* Bottom Controls Bar */}
      {canPlay && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 transition-opacity duration-300 space-y-2 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Bar (Scrubber) */}
          <div className="relative flex items-center group/scrub">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 hover:h-2.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all"
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2 pt-1 text-white">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-1.5 hover:text-amber-400 text-slate-100 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Prev Lecture */}
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Lecture"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Lecture */}
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Lecture"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500 hidden sm:block"
                />
              </div>

              {/* Time Display */}
              <div className="text-xs text-slate-300 font-mono tracking-tight pl-2">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-500 mx-1">/</span>
                <span className="text-slate-400">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Quality & Speed Settings */}
              <div className="relative">
                <button
                  onClick={() => setSettingsMenuOpen(settingsMenuOpen === 'none' ? 'main' : 'none')}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">{selectedQuality}</span>
                </button>

                {/* Settings Popup Menu */}
                {settingsMenuOpen !== 'none' && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl p-2 text-xs backdrop-blur-md z-30 animate-in fade-in zoom-in-95">
                    {settingsMenuOpen === 'main' && (
                      <div className="space-y-1">
                        <button
                          onClick={() => setSettingsMenuOpen('speed')}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200"
                        >
                          <span>Playback Speed</span>
                          <span className="text-amber-400 font-bold">{playbackSpeed}x</span>
                        </button>
                        <button
                          onClick={() => setSettingsMenuOpen('quality')}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200"
                        >
                          <span>Quality</span>
                          <span className="text-amber-400 font-bold">{selectedQuality}</span>
                        </button>
                      </div>
                    )}

                    {settingsMenuOpen === 'speed' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800 font-bold text-slate-400 px-1">
                          <span>Speed</span>
                          <button onClick={() => setSettingsMenuOpen('main')} className="text-slate-400 hover:text-white">Back</button>
                        </div>
                        {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between ${
                              playbackSpeed === s ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <span>{s === 1 ? 'Normal (1x)' : `${s}x`}</span>
                            {playbackSpeed === s && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}

                    {settingsMenuOpen === 'quality' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800 font-bold text-slate-400 px-1">
                          <span>Available Qualities</span>
                          <button onClick={() => setSettingsMenuOpen('main')} className="text-slate-400 hover:text-white">Back</button>
                        </div>
                        {/* Only available qualities! */}
                        {availableQualities.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between ${
                              selectedQuality === q ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

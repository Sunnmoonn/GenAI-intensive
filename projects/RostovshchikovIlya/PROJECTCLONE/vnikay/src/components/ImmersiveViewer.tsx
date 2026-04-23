import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { scenes } from "../data/scenes";
import type { SubtitleLine } from "../data/scenes";

export default function ImmersiveViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleLine | null>(null);
  const [subtitleVisible, setSubtitleVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const prevSubtitleRef = useRef<SubtitleLine | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef<number | null>(null);
  const wheelCooldown = useRef(false);

  const scene = scenes[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
    setCurrentSubtitle(null);
    prevSubtitleRef.current = null;
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    const time = videoRef.current?.currentTime ?? 0;
    const match = scene.subtitles.find(s => time >= s.start && time < s.end) ?? null;
    if (match?.start !== prevSubtitleRef.current?.start) {
      setSubtitleVisible(false);
      setTimeout(() => {
        setCurrentSubtitle(match);
        prevSubtitleRef.current = match;
        setSubtitleVisible(true);
      }, 150);
    }
  };

  const goTo = (index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTransitioning(false);
    }, 300);
  };

  const goNext = () => { if (currentIndex < scenes.length - 1) goTo(currentIndex + 1); };
  const goPrev = () => { if (currentIndex > 0) goTo(currentIndex - 1); };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  // Touch swipe (всё окно)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext();
      else goPrev();
    }
    touchStartY.current = null;
  };

  // Колесо мыши / тачпад
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelCooldown.current) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelCooldown.current = true;
    setTimeout(() => { wheelCooldown.current = false; }, 800);
    if (e.deltaY > 0) goNext();
    else goPrev();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: "linear-gradient(160deg, #0f0f13 0%, #1a1025 50%, #0f0f13 100%)" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 600px 500px at 50% 40%, rgba(120,60,255,0.1) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <div className="text-center relative z-10" style={{ marginBottom: 32 }}>
        <h1 className="font-black text-white" style={{ fontSize: 40, letterSpacing: "-1px", lineHeight: 1 }}>
          Вникай
        </h1>
        <p className="font-semibold tracking-[0.2em]" style={{
          fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 10,
        }}>
          УЧИ АНГЛИЙСКИЙ ЗАЛИПАЯ В ТЕЛЕФОН
        </p>
      </div>

      {/* Phone + subtitles side by side */}
      <div className="flex items-center relative z-10" style={{ gap: 48 }}>

        {/* Phone frame */}
        <div className="relative flex-shrink-0" style={{ width: 300, height: 610 }}>
          {/* Glow */}
          <div className="absolute inset-0 rounded-[3rem] pointer-events-none" style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(120,60,255,0.12)",
          }} />
          {/* Shell */}
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden" style={{
            border: "7px solid #1e1e26", background: "#000",
          }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 z-20 rounded-b-2xl" style={{
              width: 88, height: 22, background: "#1e1e26", transform: "translateX(-50%)",
            }} />

            <video
              ref={videoRef}
              key={scene.id}
              className="w-full h-full object-cover"
              style={{ transition: "opacity 0.3s ease", opacity: transitioning ? 0 : 1 }}
              autoPlay loop muted={muted} playsInline
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={scene.videoUrl} type="video/mp4" />
            </video>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 z-10" style={{
              height: 90,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
            }} />

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20" style={{ gap: 6 }}>
              {scenes.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300" style={{
                  width: i === currentIndex ? 18 : 6,
                  height: 6,
                  background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.25)",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: subtitles + controls */}
        <div className="flex flex-col justify-center" style={{ width: 260 }}>

          {/* Subtitles */}
          <div
            style={{
              minHeight: 140,
              transition: "opacity 0.15s ease",
              opacity: subtitleVisible ? 1 : 0,
            }}
          >
            {currentSubtitle ? (
              <>
                <p className="text-white font-semibold" style={{ fontSize: 18, lineHeight: 1.75 }}>
                  {currentSubtitle.ru}
                </p>
                <p className="font-medium" style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(160,120,255,0.85)", marginTop: 8 }}>
                  {currentSubtitle.en}
                </p>
              </>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 20, letterSpacing: "0.4em" }}>· · ·</p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

          {/* Controls */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <button onClick={togglePlay} className="flex items-center justify-center rounded-full transition-all" style={{
              width: 44, height: 44,
              background: playing ? "rgba(255,255,255,0.1)" : "rgba(120,60,255,0.55)",
              color: "#fff",
              boxShadow: playing ? "none" : "0 0 24px rgba(120,60,255,0.5)",
            }}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={toggleMute} className="flex items-center justify-center rounded-full transition-all" style={{
              width: 44, height: 44,
              background: "rgba(255,255,255,0.07)",
              color: muted ? "rgba(255,255,255,0.35)" : "#fff",
            }}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <p className="font-medium tracking-widest" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
              {currentIndex + 1} / {scenes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  FlameIcon,
  SunIcon,
  MoonIcon,
  DropletIcon,
  DumbbellIcon,
  BellIcon,
  AlarmClockIcon,
  MusicIcon,
  RadarIcon,
  TrophyIcon,
  CheckIcon,
  PartyPopperIcon,
  LockIcon,
  ChartBarIcon,
  ZapIcon,
  GemIcon,
  CrownIcon,
  StarRating,
  TapIcon,
} from "../components/Icons";
import AwardLottie from "../components/AwardLottie";
import "./../App.css";

// Award milestone definitions matching Streako's AwardsConstants assets
interface AwardItem {
  id: string;
  badgeLabel: string;
  badgeVariant: "unlocked" | "progress" | "locked";
  points: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  lottieSrc: string;
  settledProgress: number;
  featured?: boolean;
  fallbackIcon: React.ReactNode;
}

const AWARDS: AwardItem[] = [
  {
    id: "three-day",
    badgeLabel: "UNLOCKED",
    badgeVariant: "unlocked",
    points: "+50 XP",
    title: "3-Day Streak",
    subtitle: "Momentum Builder",
    description:
      "Forming the neural foundation of consistency. Conquering 3 consecutive days bridges the gap between raw effort and habit automaticity.",
    quote: '"Starting is the hardest obstacle."',
    lottieSrc: `${import.meta.env.BASE_URL}assets/threeDay.json`,
    settledProgress: 0.65,
    fallbackIcon: <ZapIcon size={34} />,
  },
  {
    id: "seven-day",
    badgeLabel: "UNLOCKED",
    badgeVariant: "unlocked",
    points: "+150 XP",
    title: "7-Day Streak",
    subtitle: "Weekly Champion",
    description:
      "Unstoppable dedication. Completing a full 7-day week without missing a beat cements your identity as someone who shows up, rain or shine.",
    quote: '"Transforming daily actions into superpowers."',
    lottieSrc: `${import.meta.env.BASE_URL}assets/sevenDay.json`,
    settledProgress: 0.65,
    featured: true,
    fallbackIcon: <TrophyIcon size={34} />,
  },
  {
    id: "fourteen-day",
    badgeLabel: "IN PROGRESS",
    badgeVariant: "progress",
    points: "+300 XP",
    title: "14-Day Streak",
    subtitle: "Discipline Architect",
    description:
      "Two uninterrupted weeks of conscious repetition. Your brain is physically wiring new myelin sheath pathways, eliminating resistance.",
    quote: '"Consistency becomes second nature."',
    lottieSrc: `${import.meta.env.BASE_URL}assets/Trophy.json`,
    settledProgress: 0.85,
    fallbackIcon: <GemIcon size={34} />,
  },
  {
    id: "thirty-day",
    badgeLabel: "MILESTONE",
    badgeVariant: "locked",
    points: "+750 XP",
    title: "30-Day Streak",
    subtitle: "Habit Master",
    description:
      "A full month of unbreakable commitment. You have surpassed 98% of people who set goals and transformed routine into identity.",
    quote: '"You are the architect of your destiny."',
    lottieSrc: `${import.meta.env.BASE_URL}assets/trophywon.json`,
    settledProgress: 0.65,
    fallbackIcon: <CrownIcon size={34} />,
  },
];

// Audio tone definitions matching Streako's AlarmTone constants
interface ToneItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  src: string;
}

const ALARM_TONES: ToneItem[] = [
  {
    id: "classic",
    name: "Classic Bell",
    subtitle:
      "High-energy urgent dual-tone beeps for non-negotiable morning habits",
    icon: <BellIcon size={24} />,
    src: `${import.meta.env.BASE_URL}assets/alarm.wav`,
  },
  {
    id: "digital",
    name: "Digital Siren",
    subtitle: "Rapid alternating electronic alert designed to break inertia",
    icon: <AlarmClockIcon size={24} />,
    src: `${import.meta.env.BASE_URL}assets/digital_alarm.wav`,
  },
  {
    id: "chime",
    name: "Chime Melody",
    subtitle: "Harmonious bright melodic bell cadence ideal for mindfulness",
    icon: <MusicIcon size={24} />,
    src: `${import.meta.env.BASE_URL}assets/chime_alarm.wav`,
  },
  {
    id: "radar",
    name: "Radar Pulse",
    subtitle:
      "Insistent sonar-style repeating sweep for workout & hydration check-ins",
    icon: <RadarIcon size={24} />,
    src: `${import.meta.env.BASE_URL}assets/radar_alarm.wav`,
  },
];

// Simulator Habit Data
interface SimHabit {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
  icon: React.ReactNode;
}

export function HomePage() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Hero Phone Mockup Interactive Habit State
  const [heroHabitDone, setHeroHabitDone] = useState(false);
  const [heroStreak, setHeroStreak] = useState(7);

  // Simulator State
  const [simHabits, setSimHabits] = useState<SimHabit[]>([
    {
      id: 1,
      title: "Morning Sunlight & Walk",
      desc: "15 min outside to anchor circadian rhythms",
      completed: true,
      icon: <SunIcon size={16} className="habit-inline-icon" />,
    },
    {
      id: 2,
      title: "Drink 2L Filtered Water",
      desc: "Stay energized throughout working sessions",
      completed: true,
      icon: <DropletIcon size={16} className="habit-inline-icon" />,
    },
    {
      id: 3,
      title: "45 Min Focused Workout",
      desc: "Strength training or cardiovascular movement",
      completed: false,
      icon: <DumbbellIcon size={16} className="habit-inline-icon" />,
    },
    {
      id: 4,
      title: "Screen-Free Night Wind-Down",
      desc: "Read fiction or journal before turning lights off",
      completed: false,
      icon: <MoonIcon size={16} className="habit-inline-icon" />,
    },
  ]);
  const [simStreak, setSimStreak] = useState(6);

  // Soundscape audio player state
  const [playingToneId, setPlayingToneId] = useState<string | null>(null);
  const [loadingToneId, setLoadingToneId] = useState<string | null>(null);
  const [toneError, setToneError] = useState<{ id: string; message: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Celebration Modal state & native top-layer dialog refs
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationSource, setCelebrationSource] = useState<'hero' | 'simulator'>('hero');
  const celebrationDialogRef = useRef<HTMLDialogElement | null>(null);
  const pointerDownOnBackdropRef = useRef(false);
  const celebrationTimerRef = useRef<number | null>(null);

  // Awards Lottie animation motion preference and explicit user override
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return false;
      }
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  );
  const [awardsMotionOverride, setAwardsMotionOverride] = useState<
    boolean | null
  >(null);
  const awardsPaused = awardsMotionOverride ?? prefersReducedMotion;

  // Dynamic greeting based on current local hour
  const [timeGreeting] = useState<string>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  });

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      setAwardsMotionOverride(null);
    };
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    document.title = "Streako — Modern Habit & Ritual Tracker";

    // Accessible focus management for route transitions
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }

    return () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current);
      }
    };
  }, []);

  // Synchronize native top-layer celebration <dialog>
  useEffect(() => {
    const dialog = celebrationDialogRef.current;
    if (!dialog) return;

    dialog.setAttribute("closedby", "any");

    if (celebrationOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [celebrationOpen]);

  const scheduleCelebration = (source: "hero" | "simulator") => {
    if (celebrationTimerRef.current !== null) {
      window.clearTimeout(celebrationTimerRef.current);
    }
    setCelebrationSource(source);
    celebrationTimerRef.current = window.setTimeout(() => {
      celebrationTimerRef.current = null;
      setCelebrationOpen(true);
    }, 400);
  };

  const cancelScheduledCelebration = () => {
    if (celebrationTimerRef.current !== null) {
      window.clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }
  };

  // Play isolated check feedback audio without disrupting Soundscape preview state
  const playAudioFeedback = (src: string) => {
    try {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlayingToneId(null);
        setLoadingToneId(null);
      }
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.src = src;
        feedbackAudioRef.current.currentTime = 0;
        feedbackAudioRef.current.play().catch(() => {});
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Handle Hero Habit Toggle
  const handleHeroHabitClick = () => {
    cancelScheduledCelebration();
    if (!heroHabitDone) {
      setHeroHabitDone(true);
      setHeroStreak(8);
      playAudioFeedback(`${import.meta.env.BASE_URL}assets/chime_alarm.wav`);
      scheduleCelebration("hero");
    } else {
      setHeroHabitDone(false);
      setHeroStreak(7);
    }
  };

  // Handle Simulator Habit Toggle
  const toggleSimHabit = (id: number) => {
    cancelScheduledCelebration();
    const updated = simHabits.map((h) =>
      h.id === id ? { ...h, completed: !h.completed } : h,
    );
    setSimHabits(updated);

    const completedCount = updated.filter((h) => h.completed).length;
    if (completedCount === updated.length) {
      setSimStreak(7);
      playAudioFeedback(`${import.meta.env.BASE_URL}assets/chime_alarm.wav`);
      scheduleCelebration("simulator");
    } else {
      setSimStreak(6);
    }
  };

  const resetSimulator = () => {
    cancelScheduledCelebration();
    setSimHabits([
      {
        id: 1,
        title: "Morning Sunlight & Walk",
        desc: "15 min outside to anchor circadian rhythms",
        completed: true,
        icon: <SunIcon size={16} className="habit-inline-icon" />,
      },
      {
        id: 2,
        title: "Drink 2L Filtered Water",
        desc: "Stay energized throughout working sessions",
        completed: true,
        icon: <DropletIcon size={16} className="habit-inline-icon" />,
      },
      {
        id: 3,
        title: "45 Min Focused Workout",
        desc: "Strength training or cardiovascular movement",
        completed: false,
        icon: <DumbbellIcon size={16} className="habit-inline-icon" />,
      },
      {
        id: 4,
        title: "Screen-Free Night Wind-Down",
        desc: "Read fiction or journal before turning lights off",
        completed: false,
        icon: <MoonIcon size={16} className="habit-inline-icon" />,
      },
    ]);
    setSimStreak(6);
  };

  // Handle Audio Tone Play/Pause with loading and error handling
  const handleTonePlay = (tone: ToneItem) => {
    if (!audioRef.current) return;
    setToneError(null);

    if (playingToneId === tone.id) {
      audioRef.current.pause();
      setPlayingToneId(null);
      setLoadingToneId(null);
      return;
    }

    if (feedbackAudioRef.current && !feedbackAudioRef.current.paused) {
      feedbackAudioRef.current.pause();
    }

    setLoadingToneId(tone.id);
    audioRef.current.src = tone.src;
    audioRef.current.currentTime = 0;

    audioRef.current.onended = () => {
      setPlayingToneId(null);
      setLoadingToneId(null);
    };

    audioRef.current.onerror = () => {
      setLoadingToneId(null);
      setPlayingToneId(null);
      setToneError({
        id: tone.id,
        message: "Unable to play this sound preview right now.",
      });
    };

    audioRef.current
      .play()
      .then(() => {
        setLoadingToneId(null);
        setPlayingToneId(tone.id);
      })
      .catch(() => {
        setLoadingToneId(null);
        setPlayingToneId(null);
        setToneError({
          id: tone.id,
          message: "Audio playback was blocked or failed to load.",
        });
      });
  };

  const handleCelebrationPointerDown = (
    e: React.PointerEvent<HTMLDialogElement>,
  ) => {
    if ("closedBy" in HTMLDialogElement.prototype) return;
    const dialog = celebrationDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    pointerDownOnBackdropRef.current = !inside;
  };

  const handleCelebrationPointerUp = (
    e: React.PointerEvent<HTMLDialogElement>,
  ) => {
    if (
      "closedBy" in HTMLDialogElement.prototype ||
      !pointerDownOnBackdropRef.current
    ) {
      return;
    }
    pointerDownOnBackdropRef.current = false;
    const dialog = celebrationDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) {
      setCelebrationOpen(false);
    }
  };

  const simCompletedCount = simHabits.filter((h) => h.completed).length;
  const simPercentage = Math.round(
    (simCompletedCount / simHabits.length) * 100,
  );

  // Hero percentage calculations
  const heroCompletedCount = heroHabitDone ? 4 : 3;
  const heroPercentage = heroHabitDone ? 100 : 75;
  const ringDashoffset = heroHabitDone ? 0 : 28.27;

  return (
    <main className="home-main-view">
      {/* Hidden Audio Elements for Soundscapes and Isolated Check Chimes */}
      <audio ref={audioRef} preload="none" />
      <audio ref={feedbackAudioRef} preload="none" />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-blobs" aria-hidden="true">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="container hero-grid">
          {/* Hero Left Content */}
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-icon">
                <FlameIcon size={15} />
              </span>
              <span>Tap – Track – Triumph</span>
              <span className="pill-separator">•</span>
              <span className="pill-sub">Habit Tracking Reimagined</span>
            </div>

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="hero-title"
              style={{ outline: "none" }}
            >
              Turn Daily Micro-Actions Into{" "}
              <span className="accent-text">Unstoppable</span> Life Streaks.
            </h1>

            <p className="hero-subtitle">
              Streako replaces friction and guilt with streak-based psychology,
              persistent AlarmKit audio tones, and circadian routines designed
              to turn actions into permanent habits.
            </p>

            <div className="hero-cta-group">
              <a
                href="https://play.google.com/store/apps/details?id=com.ethicsofcoding.streako"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <svg
                  className="btn-store-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path d="M3.609 1.814L13.793 12 3.61 22.186A2.25 2.25 0 0 1 3 20.6V3.4a2.25 2.25 0 0 1 .609-1.586zm11.603 11.603l2.67 2.67-12.06 6.892 9.39-9.562zm0-2.834L5.822 1.021l12.06 6.892-2.67 2.669zM19.789 10.6l2.84 1.623a.908.908 0 0 1 0 1.554l-2.84 1.623-2.227-2.4 2.227-2.4z" />
                </svg>
                <span>Get on Google Play</span>
              </a>

              <a href="#interactive-demo" className="btn btn-secondary btn-lg">
                <span>Try Simulator</span>
                <span aria-hidden="true">&darr;</span>
              </a>

              <a href="#download" className="btn btn-ghost btn-lg">
                <svg
                  className="btn-store-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.68-1.26z" />
                </svg>
                <span>iOS (Coming Soon)</span>
              </a>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-number">100%</span>
                <span className="metric-label">Offline & Private</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">4 Tones</span>
                <span className="metric-label">AlarmKit Audio</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">0 Ads</span>
                <span className="metric-label">Zero Distractions</span>
              </div>
            </div>
          </div>

          {/* Hero Right Mockup Frame with Interactive Demo */}
          <div className="hero-mockup-wrapper">
            <div className="phone-device-frame">
              {/* Phone Notch */}
              <div className="phone-notch">
                <div className="notch-camera"></div>
                <div className="notch-speaker"></div>
              </div>

              {/* Phone Screen */}
              <div className="phone-screen">
                {/* Phone App Bar */}
                <div className="phone-app-header">
                  <div className="phone-user-greeting">
                    <div className="greeting-avatar">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/streako.png`}
                        alt="User avatar"
                        width="32"
                        height="32"
                      />
                    </div>
                    <div className="greeting-text-box">
                      <span className="greeting-time-tag">{timeGreeting}</span>
                      <p className="greeting-name">Champion</p>
                    </div>
                  </div>
                  <div className="phone-streak-badge">
                    <span className="streak-flame">
                      <FlameIcon size={16} />
                    </span>
                    <span className="streak-count">{heroStreak}</span>
                    <span className="streak-unit">days</span>
                  </div>
                </div>

                {/* Streak Overview Card */}
                <div className="phone-card">
                  <div className="summary-top">
                    <div>
                      <span className="summary-label">Streak Overview</span>
                      <p className="summary-headline">
                        {heroStreak} days streak
                      </p>
                    </div>
                    <div className="ring-progress-container">
                      <svg
                        className="ring-svg"
                        viewBox="0 0 44 44"
                        width="44"
                        height="44"
                      >
                        <circle
                          className="ring-bg"
                          cx="22"
                          cy="22"
                          r="18"
                          fill="none"
                          strokeWidth="4"
                        ></circle>
                        <circle
                          className="ring-fill"
                          cx="22"
                          cy="22"
                          r="18"
                          fill="none"
                          strokeWidth="4"
                          strokeDasharray="113.097"
                          strokeDashoffset={ringDashoffset}
                        ></circle>
                      </svg>
                      <span className="ring-percentage">{heroPercentage}%</span>
                    </div>
                  </div>
                  <p className="summary-footer-text">
                    {heroHabitDone
                      ? "Daily goal 100% conquered!"
                      : "You're building great momentum today!"}
                  </p>
                </div>

                {/* Today's Habits Header */}
                <div className="phone-section-header">
                  <span className="section-title">Today's Habits</span>
                  <span className="section-counter">
                    {heroCompletedCount} of 4 done
                  </span>
                </div>

                {/* Habit Cards List */}
                <div className="phone-habits-list">
                  <div className="mock-habit-item completed">
                    <div className="habit-icon-pill habit-orange">
                      <SunIcon size={16} />
                    </div>
                    <div className="habit-info">
                      <span className="habit-name">Morning Meditation</span>
                      <span className="habit-sub">
                        15 min • Morning routine
                      </span>
                    </div>
                    <div className="habit-check-btn checked">
                      <CheckIcon size={14} />
                    </div>
                  </div>

                  <div className="mock-habit-item completed">
                    <div className="habit-icon-pill habit-blue">
                      <DropletIcon size={16} />
                    </div>
                    <div className="habit-info">
                      <span className="habit-name">Hydrate 2.5 Liters</span>
                      <span className="habit-sub">Daily flow • 8 glasses</span>
                    </div>
                    <div className="habit-check-btn checked">
                      <CheckIcon size={14} />
                    </div>
                  </div>

                  <div className="mock-habit-item completed">
                    <div className="habit-icon-pill habit-teal">
                      <ZapIcon size={16} />
                    </div>
                    <div className="habit-info">
                      <span className="habit-name">Deep Work Sprint</span>
                      <span className="habit-sub">
                        45 min • Zero distractions
                      </span>
                    </div>
                    <div className="habit-check-btn checked">
                      <CheckIcon size={14} />
                    </div>
                  </div>

                  {/* Interactive Habit Card */}
                  <button
                    type="button"
                    className={`mock-habit-item ${heroHabitDone ? "completed" : "interactive-pulse"}`}
                    onClick={handleHeroHabitClick}
                    aria-pressed={heroHabitDone}
                    aria-label="Read 20 Pages — Evening wind down habit"
                  >
                    <div className="habit-icon-pill habit-purple" aria-hidden="true">
                      <MoonIcon size={16} />
                    </div>
                    <div className="habit-info">
                      <span className="habit-name">Read 20 Pages</span>
                      <span className="habit-sub">
                        {heroHabitDone
                          ? "Completed today!"
                          : "Evening wind down • Tap to check!"}
                      </span>
                    </div>
                    <span
                      className={`habit-check-btn ${heroHabitDone ? "checked" : ""}`}
                      aria-hidden="true"
                    >
                      {heroHabitDone ? <CheckIcon size={14} /> : null}
                    </span>
                  </button>
                </div>

                <div className="phone-bottom-bar" aria-hidden="true">
                  <span className="phone-tab active">Today</span>
                  <span className="phone-tab">Streaks</span>
                  <span className="phone-tab">Sounds</span>
                  <span className="phone-tab">Awards</span>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="phone-floating-badge badge-award">
              <span className="badge-icon">
                <TrophyIcon size={18} />
              </span>
              <div className="badge-text">
                <span className="badge-title">Weekly Champion</span>
                <span className="badge-sub">7-Day Streak Unlocked!</span>
              </div>
            </div>

            <div className="phone-floating-badge badge-reminder">
              <span className="badge-icon">
                <AlarmClockIcon size={18} />
              </span>
              <div className="badge-text">
                <span className="badge-title">AlarmKit Active</span>
                <span className="badge-sub">Chime Melody at 7:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SIMULATOR SECTION */}
      <section className="section simulator-section" id="interactive-demo">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-pill">Interactive Demo</span>
            <h2 className="section-title">
              Feel the Momentum of Daily Consistency
            </h2>
            <p className="section-subtitle">
              Tap the checklist items below. Watch your progress bar fill, build
              your daily streak momentum, and feel what makes Streako so
              addictive.
            </p>
          </div>

          <div className="simulator-card">
            <div className="simulator-header">
              <div className="sim-meta">
                <span className="sim-label">Live Habit Simulator</span>
                <h3 className="sim-title">
                  Today's Progress: {simPercentage}%
                </h3>
              </div>

              <div className="sim-streak-box">
                <span className="sim-flame-icon">
                  <FlameIcon size={22} />
                </span>
                <div>
                  <span className="sim-streak-val">{simStreak}</span>
                  <span className="sim-streak-lbl">Day Streak</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="sim-progress-track">
              <div
                className="sim-progress-fill"
                style={{ width: `${simPercentage}%` }}
              ></div>
            </div>

            {/* Habit Items */}
            <div className="sim-habit-grid">
              {simHabits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  className={`sim-habit-item ${habit.completed ? "checked" : ""}`}
                  onClick={() => toggleSimHabit(habit.id)}
                  aria-pressed={habit.completed}
                >
                  <span className="sim-check-btn" aria-hidden="true">
                    {habit.completed ? <CheckIcon size={15} /> : null}
                  </span>
                  <div className="sim-habit-text">
                    <span className="sim-h-title">
                      {habit.icon}
                      <span>{habit.title}</span>
                    </span>
                    <span className="sim-h-desc">{habit.desc}</span>
                  </div>
                  <span
                    className={`sim-h-badge ${habit.completed ? "" : "pending"}`}
                  >
                    {habit.completed ? "Done" : "Tap"}
                  </span>
                </button>
              ))}
            </div>

            <div className="sim-footer">
              <div className="sim-audio-indicator">
                <TapIcon size={16} />
                <span>Tap habits to update streak progress</span>
              </div>
              <button
                onClick={resetSimulator}
                className="btn btn-ghost btn-sm"
                type="button"
              >
                Reset Simulator
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-pill">Why Streako Works</span>
            <h2 className="section-title">
              Designed for Rituals, Not Distractions
            </h2>
            <p className="section-subtitle">
              Most productivity apps are bloated spreadsheets disguised as
              games. Streako is engineered strictly around behavioral
              neuroscience and loss aversion.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-green">
                <FlameIcon size={26} />
              </div>
              <h3 className="feature-title">Unbreakable Daily Streaks</h3>
              <p className="feature-desc">
                Visual rings and consecutive day counters harness the
                psychological power of loss aversion. Once you build a 7-day
                streak, skipping becomes unthinkable.
              </p>
              <ul className="feature-bullet-list">
                <li>
                  Automatic streak calculations with midnight grace periods
                </li>
                <li>Visual progress rings that fill with each completion</li>
                <li>Customizable frequencies: Daily, Weekdays, or Custom</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-amber">
                <SunIcon size={26} />
              </div>
              <h3 className="feature-title">Your Day, Your Flow</h3>
              <p className="feature-desc">
                Morning yoga? Afternoon deep work? Evening journaling? Group
                habits by circadian daytime intervals so you only see what
                matters right now.
              </p>
              <ul className="feature-bullet-list">
                <li>Morning, Afternoon, Evening, and Night routines</li>
                <li>Atmospheric background transitions matching the hour</li>
                <li>Zero cognitive overload from tomorrow's tasks</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <AlarmClockIcon size={26} />
              </div>
              <h3 className="feature-title">Persistent AlarmKit Audio</h3>
              <p className="feature-desc">
                Muted notifications get lost in your notification drawer.
                Streako features native AlarmKit integration with 4 curated
                alarm tones that command attention.
              </p>
              <ul className="feature-bullet-list">
                <li>Cuts through iOS Silent Mode and Android Do Not Disturb</li>
                <li>
                  High-energy bells, digital sirens, chimes & radar pulses
                </li>
                <li>Time intervals tailored to your personal schedule</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-purple">
                <TrophyIcon size={26} />
              </div>
              <h3 className="feature-title">Psychology-Backed Awards</h3>
              <p className="feature-desc">
                Unlock badges at the scientific inflection points of habit
                formation: 3-Day Spark, 7-Day Momentum, 14-Day Architect, and
                30-Day Master.
              </p>
              <ul className="feature-bullet-list">
                <li>Full-screen celebration confetti & badge animations</li>
                <li>Streak Wisdom cards explaining neural adaptations</li>
                <li>Shareable achievement cards to inspire peers</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-teal">
                <LockIcon size={26} />
              </div>
              <h3 className="feature-title">Offline-First & Truly Private</h3>
              <p className="feature-desc">
                Your personal routines, mindfulness, and reflections belong
                solely to you. Streako operates on ultra-fast Hive storage
                running directly on your phone.
              </p>
              <ul className="feature-bullet-list">
                <li>
                  Zero latency: opens instantly without spinners or loading
                </li>
                <li>Works 100% on flights, subways, and off-grid cabins</li>
                <li>Optional cloud backup with Google Sign-In</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-rose">
                <ChartBarIcon size={26} />
              </div>
              <h3 className="feature-title">Granular Activity Metrics</h3>
              <p className="feature-desc">
                Analyze your consistency score, weekly breakdown by day of week,
                completion percentages, and all-time best streaks in one elegant
                dashboard.
              </p>
              <ul className="feature-bullet-list">
                <li>Weekly breakdown with fitness ring painters</li>
                <li>Pinpoint your weakest days and optimize your routine</li>
                <li>Lifetime completion counts and streak records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SOUNDSCAPES / ALARMKIT AUDIO SECTION */}
      <section className="section soundscapes-section" id="soundscapes">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-pill">AlarmKit Audio Preview</span>
            <h2 className="section-title">Soundscapes That Wake You Up</h2>
            <p className="section-subtitle">
              Say goodbye to quiet vibrations you sleep right through. Listen to
              Streako's 4 custom-crafted alarm audio tones right now.
            </p>
          </div>

          <div className="tones-grid">
            {ALARM_TONES.map((tone) => {
              const isPlaying = playingToneId === tone.id;
              const isLoading = loadingToneId === tone.id;
              const hasError = toneError?.id === tone.id;
              return (
                <div
                  key={tone.id}
                  className={`tone-card ${isPlaying ? "playing" : ""}`}
                >
                  <div className="tone-header">
                    <div className="tone-icon-box" aria-hidden="true">{tone.icon}</div>
                    <div className="tone-info">
                      <h3 className="tone-name">{tone.name}</h3>
                      <p className="tone-desc">{tone.subtitle}</p>
                    </div>
                  </div>

                  <div className="tone-controls">
                    <button
                      onClick={() => handleTonePlay(tone)}
                      className="tone-play-btn"
                      type="button"
                      aria-pressed={isPlaying}
                      aria-busy={isLoading}
                      aria-label={`${isPlaying ? "Pause" : isLoading ? "Loading" : "Play"} ${tone.name}`}
                    >
                      {isPlaying ? (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="18"
                            height="18"
                            aria-hidden="true"
                          >
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                          </svg>
                          <span>Pause Sound</span>
                        </>
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="18"
                            height="18"
                            aria-hidden="true"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          <span>{isLoading ? "Loading..." : "Play Sound"}</span>
                        </>
                      )}
                    </button>

                    <div className="tone-waveform" aria-hidden="true">
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                    </div>
                  </div>

                  {hasError && (
                    <p className="tone-error-note" role="alert">
                      {toneError.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AWARDS & GAMIFICATION SHOWCASE */}
      <section className="section awards-section" id="awards">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-pill">Milestone Rewards</span>
            <h2 className="section-title">
              Celebrate Every Milestone of Growth
            </h2>
            <p className="section-subtitle">
              Streako turns habit formation into a rewarding hero's journey.
              Unlock prestigious badges and absorb daily streak wisdom.
            </p>
          </div>

          <div className="awards-controls">
            <button
              type="button"
              className="awards-motion-btn"
              onClick={() => setAwardsMotionOverride(!awardsPaused)}
              aria-label={
                awardsPaused
                  ? "Play award animations"
                  : "Pause award animations"
              }
            >
              {awardsPaused ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Play Animations</span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  <span>Pause Animations</span>
                </>
              )}
            </button>
          </div>

          <div className="awards-grid">
            {AWARDS.map((award) => (
              <div
                key={award.id}
                className={
                  award.featured ? "award-card featured-award" : "award-card"
                }
              >
                <div className="award-badge-top">
                  <span className={`badge-tag ${award.badgeVariant}`}>
                    {award.badgeLabel}
                  </span>
                  <span className="award-points">{award.points}</span>
                </div>
                <div className="award-animation-box">
                  <AwardLottie
                    src={award.lottieSrc}
                    paused={awardsPaused}
                    settledProgress={award.settledProgress}
                    fallback={
                      <div className="fallback-award-icon">
                        {award.fallbackIcon}
                      </div>
                    }
                  />
                </div>
                <h3 className="award-title">{award.title}</h3>
                <span className="award-subtitle">{award.subtitle}</span>
                <p className="award-desc">{award.description}</p>
                <div className="award-footer">
                  <span className="award-quote">{award.quote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SCIENCE OF STREAKS SECTION */}
      <section className="section science-section" id="science">
        <div className="container">
          <div className="science-card">
            <div className="science-grid">
              <div className="science-content">
                <span className="section-pill">Behavioral Psychology</span>
                <h2 className="science-title">
                  The Neuroscience Behind the Streak
                </h2>
                <p className="science-p">
                  Why does Streako work when calendars and standard todo apps
                  fail? It is founded on proven behavioral economics and
                  neuroplasticity:
                </p>

                <div className="science-points">
                  <div className="s-point">
                    <div className="s-num">01</div>
                    <div>
                      <h3>Loss Aversion & Sunk Cost Motivation</h3>
                      <p>
                        When you have invested 14 consecutive days into a
                        streak, your brain naturally resists throwing away that
                        hard-won progress.
                      </p>
                    </div>
                  </div>

                  <div className="s-point">
                    <div className="s-num">02</div>
                    <div>
                      <h3>Frictionless Action Triggers</h3>
                      <p>
                        Audible AlarmKit tones paired with 1-tap completions
                        remove decision fatigue before resistance has a chance
                        to take root.
                      </p>
                    </div>
                  </div>

                  <div className="s-point">
                    <div className="s-num">03</div>
                    <div>
                      <h3>Identity-Based Transformation</h3>
                      <p>
                        Every checkmark is a vote for the person you want to be.
                        Streaks cement habit automaticity into who you are.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="science-quote-column">
                <div className="quote-card">
                  <span className="quote-mark">“</span>
                  <p className="quote-text">
                    Reaching 3 consecutive days bridges the gap between effort
                    and habit automaticity. Completing 7 days cements your
                    identity as someone who shows up.
                  </p>
                  <div className="quote-author">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/streako.png`}
                      alt="Streako Icon"
                      width="40"
                      height="40"
                    />
                    <div>
                      <strong>Streako Behavioral Lab</strong>
                      <span>Built into Streako Core</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-pill">Real Stories</span>
            <h2 className="section-title">Loved by High Performers</h2>
            <p className="section-subtitle">
              Discover how builders, athletes, and professionals built lasting
              routines with Streako.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <StarRating count={5} className="test-stars" />
              <p className="test-quote">
                "The AlarmKit soundscapes are a game changer. Standard
                notifications got buried in my lock screen. Streako’s Classic
                Bell gets me out of bed every morning at 6 AM."
              </p>
              <div className="test-user">
                <div className="test-avatar">SK</div>
                <div>
                  <strong>Siddharth K.</strong>
                  <span>Software Engineer • 42-day streak</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <StarRating count={5} className="test-stars" />
              <p className="test-quote">
                "I love that it works completely offline and doesn't push
                annoying monthly paywalls. Clean Lexend typography, soothing
                colors, and zero clutter. Just pure habit momentum."
              </p>
              <div className="test-user">
                <div className="test-avatar">MR</div>
                <div>
                  <strong>Maya R.</strong>
                  <span>Meditation Teacher • 89-day streak</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <StarRating count={5} className="test-stars" />
              <p className="test-quote">
                "Seeing my fitness rings fill up as I complete my hydration and
                workout habits is intensely satisfying. Best habit tracker I’ve
                ever installed."
              </p>
              <div className="test-user">
                <div className="test-avatar">DL</div>
                <div>
                  <strong>David L.</strong>
                  <span>Triathlete & Founder • 65-day streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="section faq-section" id="faq">
        <div className="container max-w-md">
          <div className="section-heading text-center">
            <span className="section-pill">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about Streako, privacy, and streak
              tracking.
            </p>
          </div>

          <div className="faq-accordion">
            <details className="faq-item" open>
              <summary className="faq-question">
                <span>How is Streako different from standard todo apps?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="faq-answer">
                <p>
                  Todo lists track one-off tasks you delete once finished.
                  Streako is designed specifically for recurring habits and
                  neuroplastic automaticity. With streak momentum, custom
                  AlarmKit tones that cut through silent mode, and daytime flow
                  grouping (Morning, Evening, Night), it keeps your daily
                  rituals effortless and automatic.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Does Streako work offline?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes, 100%! Streako is built on ultra-fast local Hive storage.
                  You can check off habits on flights, subway commutes, or
                  wilderness retreats with zero internet required. If you choose
                  to sign in with Google, your habits sync automatically when
                  back online.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Will the alarms sound if my phone is on silent?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="faq-answer">
                <p>
                  Streako integrates with native AlarmKit on iOS and exact alarm
                  channels on Android, allowing priority habit alarms to alert
                  you even when your phone is in silent or do-not-disturb mode
                  when granted permission.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Is my habit and personal data secure and private?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="faq-answer">
                <p>
                  Strictly private. We do not sell data to third-party brokers
                  or inject tracking pixels. Your habits stay on your device
                  encrypted under sandboxed operating system permissions.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Can I customize habit frequencies?</span>
                <svg
                  className="faq-chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes! You can configure habits for Every Day, Weekdays only
                  (Monday through Friday), Weekends only, or custom intervals
                  (e.g., 3 days per week). Streako respects your scheduled days
                  so rest days never break your streak.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* DOWNLOAD / FINAL CTA SECTION */}
      <section className="section download-section" id="download">
        <div className="container">
          <div className="download-banner">
            <div className="banner-blob" aria-hidden="true"></div>

            <div className="download-content">
              <img
                src={`${import.meta.env.BASE_URL}assets/streako.png`}
                alt="Streako Icon"
                className="download-app-icon"
                width="84"
                height="84"
              />
              <h2 className="download-title">
                Start Building Your Unstoppable Streak Today
              </h2>
              <p className="download-subtitle">
                Join thousands of consistent achievers turning small daily
                actions into lifelong triumphs. Available now on Android, with
                iOS coming soon.
              </p>

              <div className="download-buttons">
                <a
                  href="https://play.google.com/store/apps/details?id=com.ethicsofcoding.streako"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-badge-btn"
                  aria-label="Get it on Google Play Store (com.ethicsofcoding.streako)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="28"
                    height="28"
                    aria-hidden="true"
                  >
                    <path d="M3.609 1.814L13.793 12 3.61 22.186A2.25 2.25 0 0 1 3 20.6V3.4a2.25 2.25 0 0 1 .609-1.586zm11.603 11.603l2.67 2.67-12.06 6.892 9.39-9.562zm0-2.834L5.822 1.021l12.06 6.892-2.67 2.669zM19.789 10.6l2.84 1.623a.908.908 0 0 1 0 1.554l-2.84 1.623-2.227-2.4 2.227-2.4z" />
                  </svg>
                  <div className="store-btn-text">
                    <span className="store-small">GET IT ON</span>
                    <span className="store-big">Google Play Store</span>
                  </div>
                </a>

                <div
                  className="store-badge-btn is-coming-soon"
                  role="note"
                  aria-label="Apple App Store version coming soon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="28"
                    height="28"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.68-1.26z" />
                  </svg>
                  <div className="store-btn-text">
                    <span className="store-small">COMING SOON ON</span>
                    <span className="store-big">Apple App Store</span>
                  </div>
                </div>
              </div>

              <div className="qr-preview-box">
                <svg
                  className="qr-code-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 41 41"
                  shapeRendering="crispEdges"
                  role="img"
                  aria-label="QR code linking to Streako on Google Play Store"
                >
                  <path fill="#FFFFFF" d="M0 0h41v41H0z" />
                  <path
                    stroke="#10251E"
                    d="M2 2.5h7m2 0h5m2 0h1m4 0h3m1 0h1m2 0h1m1 0h7M2 3.5h1m5 0h1m4 0h1m1 0h1m1 0h4m1 0h1m3 0h4m2 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h2m1 0h3m2 0h1m4 0h2m3 0h1m1 0h1m1 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1m1 0h1m2 0h3m2 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h2m2 0h1m2 0h9m4 0h1m1 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h4m3 0h1m1 0h1m7 0h1m1 0h2m1 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m4 0h3m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1M2 10.5h1m1 0h5m6 0h2m1 0h1m5 0h2m1 0h2m3 0h5M2 11.5h2m1 0h3m1 0h1m1 0h1m2 0h1m1 0h2m1 0h2m1 0h2m1 0h1m4 0h2m1 0h1m3 0h1M2 12.5h2m4 0h1m1 0h6m1 0h3m1 0h1m1 0h2m2 0h4m1 0h2m1 0h1m1 0h2M2 13.5h1m1 0h3m2 0h1m2 0h1m1 0h4m3 0h3m1 0h2m1 0h1m1 0h1m1 0h2m1 0h1m2 0h1M2 14.5h4m2 0h2m1 0h1m1 0h2m2 0h3m1 0h2m1 0h1m1 0h3m2 0h4m1 0h3M2 15.5h2m2 0h2m3 0h1m1 0h1m4 0h1m1 0h4m1 0h3m2 0h1m2 0h1M5 16.5h1m2 0h2m1 0h4m2 0h1m2 0h1m2 0h2m2 0h9m1 0h2M2 17.5h2m2 0h1m5 0h1m1 0h1m1 0h3m4 0h2m3 0h1m1 0h1m1 0h3m2 0h2M3 18.5h4m1 0h1m3 0h1m1 0h1m1 0h1m3 0h1m1 0h1m1 0h2m1 0h3m1 0h2m1 0h1m1 0h1M4 19.5h3m2 0h1m3 0h1m2 0h3m6 0h1m1 0h1m2 0h1m2 0h1m2 0h2M4 20.5h8m3 0h2m5 0h1m1 0h1m1 0h1m1 0h4m2 0h1m2 0h2M3 21.5h4m3 0h1m1 0h1m5 0h1m1 0h1m2 0h3m6 0h3m3 0h1M2 22.5h2m2 0h1m1 0h3m1 0h1m1 0h1m4 0h1m2 0h1m1 0h6m1 0h2m1 0h3M2 23.5h3m7 0h5m1 0h8m4 0h1m4 0h1M4 24.5h3m1 0h2m1 0h1m1 0h1m2 0h4m2 0h2m4 0h2m3 0h3m1 0h2M2 25.5h1m3 0h1m2 0h3m1 0h1m1 0h3m1 0h2m2 0h3m4 0h1m1 0h3m2 0h1M2 26.5h1m1 0h2m2 0h2m1 0h2m1 0h1m3 0h1m5 0h5m1 0h3m1 0h1m1 0h2M2 27.5h2m2 0h1m3 0h1m1 0h1m1 0h2m1 0h1m2 0h1m1 0h2m1 0h2m3 0h1m4 0h1M2 28.5h1m4 0h2m1 0h3m1 0h2m1 0h2m2 0h1m6 0h3m1 0h2m2 0h3M2 29.5h1m3 0h2m1 0h2m3 0h1m2 0h1m3 0h3m1 0h1m2 0h1m2 0h4m3 0h1M2 30.5h1m1 0h1m1 0h3m1 0h2m3 0h3m1 0h1m1 0h1m2 0h1m1 0h2m1 0h8M10 31.5h4m2 0h1m1 0h1m2 0h2m2 0h1m1 0h1m1 0h2m3 0h2m1 0h1M2 32.5h7m2 0h2m1 0h5m1 0h1m1 0h1m7 0h1m1 0h1m1 0h1m1 0h1m1 0h1M2 33.5h1m5 0h1m1 0h2m1 0h5m3 0h6m1 0h3m3 0h2m1 0h1M2 34.5h1m1 0h3m1 0h1m1 0h1m3 0h1m1 0h2m2 0h2m2 0h1m1 0h9m1 0h1m1 0h1M2 35.5h1m1 0h3m1 0h1m1 0h2m2 0h1m1 0h3m4 0h1m1 0h1m1 0h1m3 0h2m1 0h1m1 0h1m1 0h1M2 36.5h1m1 0h3m1 0h1m1 0h1m1 0h2m8 0h3m1 0h6m4 0h3M2 37.5h1m5 0h1m5 0h1m1 0h1m1 0h1m1 0h6m3 0h2m3 0h1m3 0h1M2 38.5h7m1 0h5m1 0h1m2 0h1m1 0h1m3 0h4m2 0h2m1 0h5"
                  />
                </svg>
                <span className="qr-text">
                  Scan with your smartphone camera to open Streako on Google Play
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NATIVE TOP-LAYER CELEBRATION DIALOG */}
      <dialog
        ref={celebrationDialogRef}
        className="celebration-dialog"
        aria-labelledby="celebration-modal-title"
        onClose={() => setCelebrationOpen(false)}
        onPointerDown={handleCelebrationPointerDown}
        onPointerUp={handleCelebrationPointerUp}
      >
        <div className="modal-card-content">
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setCelebrationOpen(false)}
            aria-label="Close celebration dialog"
          >
            &times;
          </button>
          <div className="modal-badge-icon" aria-hidden="true">
            <PartyPopperIcon size={44} />
          </div>
          <h2 id="celebration-modal-title" className="modal-title">
            {celebrationSource === "hero"
              ? "Daily Routine Completed!"
              : "Streak Milestone Conquered!"}
          </h2>
          <p className="modal-message">
            {celebrationSource === "hero"
              ? "You completed all 4 daily habits in your preview tracker — lifting your streak to 8 days."
              : "You completed all scheduled habits in the simulator! Your 7-day streak momentum is unstoppable."}
          </p>
          <div className="modal-actions">
            <form method="dialog">
              <button
                type="submit"
                autoFocus
                className="btn btn-primary btn-md"
              >
                Keep Up The Momentum
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </main>
  );
}

export default HomePage;

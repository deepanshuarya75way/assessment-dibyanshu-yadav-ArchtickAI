import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon, ArrowUpRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/configs/axios";
import { motion } from "framer-motion";

const Home = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return navigate("/login");
    }
    if (input.trim() === "") {
      return toast.error("Please enter a prompt");
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/website-project/create", { initial_prompt: input });
      toast.success("Architect AI is building your vision...");
      setLoading(false);
      navigate(`/project/${res.data.project_id}`);
    } catch (error) {
      toast.error("The architect encountered an error. Please try again.");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <div className="arch-root relative min-h-screen overflow-hidden">

      {/* Blueprint Grid */}
      <div className="arch-grid" aria-hidden="true" />

      {/* Horizon line */}
      <div className="arch-horizon" aria-hidden="true" />

      {/* Corner marks */}
      <div className="arch-corner arch-corner--tl" aria-hidden="true" />
      <div className="arch-corner arch-corner--tr" aria-hidden="true" />
      <div className="arch-corner arch-corner--bl" aria-hidden="true" />
      <div className="arch-corner arch-corner--br" aria-hidden="true" />

      {/* Ambient glow */}
      <div className="arch-ambient" aria-hidden="true" />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="arch-content relative z-10 flex flex-col items-center px-6 md:px-12 max-w-6xl mx-auto pt-40 pb-28"
      >

        {/* Status badge */}
        <motion.div variants={itemVariants} className="arch-badge mb-10">
          <span className="arch-badge__dot" />
          <span className="arch-badge__label">ARCHITECT AI ENGINE v2.0</span>
          <span className="arch-badge__sep">·</span>
          <span className="arch-badge__sub">SYSTEM ONLINE</span>
        </motion.div>

        {/* Eyebrow label */}
        <motion.p variants={itemVariants} className="arch-eyebrow mb-6">
          AI-POWERED WEB SYNTHESIS
        </motion.p>

        {/* Hero Title */}
        <motion.h1 variants={itemVariants} className="arch-title text-center mb-6">
          <span className="arch-title__line">Forge Your</span>
          <span className="arch-title__accent"> Digital Legacy</span>
          <span className="arch-title__line"> with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="arch-subtitle text-center max-w-xl mb-16">
          Transmute concepts into high-fidelity web experiences instantly.
          Architect AI synthesizes professional design and code while you maintain creative control.
        </motion.p>

        {/* Creation Form */}
        <motion.div variants={itemVariants} className="arch-card w-full max-w-3xl mb-24">

          {/* Card top bar */}
          <div className="arch-card__topbar">
            <div className="arch-card__dots">
              <span /><span /><span />
            </div>
            <span className="arch-card__label">PROMPT_CONSOLE</span>
            <span className="arch-card__cursor">_</span>
          </div>

          <form onSubmit={onSubmitHandler}>
            <div className="arch-card__body">
              <div className="arch-card__line-nums" aria-hidden="true">
                {[...Array(6)].map((_, i) => (
                  <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                ))}
              </div>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="arch-textarea"
                placeholder="Command the AI... (e.g., A brutalist landing page for a creative agency with neon accents)"
                required
              />
            </div>

            {/* Card bottom bar */}
            <div className="arch-card__footer">
              <div className="arch-card__meta">
                <div className="arch-avatars">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="arch-avatar">{i === 3 ? "+" : ""}</div>
                  ))}
                </div>
                <span className="arch-card__count">10k+ architects deployed</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="arch-btn"
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="animate-spin" size={16} />
                    <span>SYNTHESIZING</span>
                  </>
                ) : (
                  <>
                    <span>INITIATE BUILD</span>
                    <ArrowUpRight size={16} />
                  </>
                )}
              </motion.button>
            </div>
          </form>

        </motion.div>

        {/* Tech Stack Section */}
        <motion.div variants={itemVariants} className="arch-stack w-full max-w-4xl">

          <div className="arch-stack__header">
            <div className="arch-stack__line" />
            <span className="arch-stack__label">ELITE TECHNOLOGY STACK</span>
            <div className="arch-stack__line" />
          </div>

          <div className="arch-stack__grid">
            {[
              { name: "React", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" },
              { name: "Tailwind", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" },
              { name: "Node", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" },
              { name: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
              { name: "Python", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" }
            ].map((tech, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="arch-tech"
              >
                <div className="arch-tech__icon-wrap">
                  <img className="arch-tech__icon" src={tech.icon} alt={tech.name} />
                </div>
                <span className="arch-tech__name">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.section>

      <style>{`
        /* ── Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        /* ── Root ── */
        .arch-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
          min-height: 100vh;
        }

        /* ── Blueprint Grid ── */
        .arch-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(245,196,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,196,55,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Horizon Line ── */
        .arch-horizon {
          position: fixed;
          top: 50%;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,196,55,0.12), transparent);
          z-index: 0;
          pointer-events: none;
        }

        /* ── Corner Marks ── */
        .arch-corner {
          position: fixed;
          width: 40px; height: 40px;
          z-index: 1;
          pointer-events: none;
        }
        .arch-corner::before, .arch-corner::after {
          content: '';
          position: absolute;
          background: rgba(245,196,55,0.35);
        }
        .arch-corner::before { width: 100%; height: 1px; }
        .arch-corner::after  { height: 100%; width: 1px; }

        .arch-corner--tl { top: 24px; left: 24px; }
        .arch-corner--tl::before { top: 0; left: 0; }
        .arch-corner--tl::after  { top: 0; left: 0; }

        .arch-corner--tr { top: 24px; right: 24px; }
        .arch-corner--tr::before { top: 0; right: 0; }
        .arch-corner--tr::after  { top: 0; right: 0; }

        .arch-corner--bl { bottom: 24px; left: 24px; }
        .arch-corner--bl::before { bottom: 0; left: 0; }
        .arch-corner--bl::after  { bottom: 0; left: 0; }

        .arch-corner--br { bottom: 24px; right: 24px; }
        .arch-corner--br::before { bottom: 0; right: 0; }
        .arch-corner--br::after  { bottom: 0; right: 0; }

        /* ── Ambient Glow ── */
        .arch-ambient {
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px; height: 600px;
          background: radial-gradient(ellipse, rgba(245,196,55,0.06) 0%, transparent 65%);
          z-index: 0;
          pointer-events: none;
        }

        /* ── Badge ── */
        .arch-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid rgba(245,196,55,0.3);
          background: rgba(245,196,55,0.04);
          color: #f5c437;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          border-radius: 2px;
        }
        .arch-badge__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f5c437;
          box-shadow: 0 0 8px #f5c437;
          animation: arch-blink 1.8s ease-in-out infinite;
        }
        .arch-badge__label { color: #f5c437; }
        .arch-badge__sep   { opacity: 0.4; }
        .arch-badge__sub   { opacity: 0.6; }

        @keyframes arch-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ── Eyebrow ── */
        .arch-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.35em;
          color: rgba(245,196,55,0.5);
        }

        /* ── Title ── */
        .arch-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(3rem, 8vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #e8e6e0;
        }
        .arch-title__accent {
          color: #f5c437;
          -webkit-text-stroke: 0px;
          text-shadow: 0 0 60px rgba(245,196,55,0.3);
        }

        /* ── Subtitle ── */
        .arch-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          line-height: 1.9;
          color: rgba(232,230,224,0.45);
          letter-spacing: 0.01em;
        }

        /* ── Card ── */
        .arch-card {
          background: rgba(10,12,18,0.9);
          border: 1px solid rgba(245,196,55,0.18);
          border-radius: 4px;
          box-shadow:
            0 0 0 1px rgba(245,196,55,0.05),
            0 32px 80px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(245,196,55,0.08);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .arch-card:hover {
          border-color: rgba(245,196,55,0.32);
          box-shadow:
            0 0 0 1px rgba(245,196,55,0.1),
            0 40px 100px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(245,196,55,0.12);
        }

        .arch-card__topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(245,196,55,0.08);
          background: rgba(245,196,55,0.02);
        }
        .arch-card__dots {
          display: flex; gap: 6px;
        }
        .arch-card__dots span {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: rgba(245,196,55,0.15);
          border: 1px solid rgba(245,196,55,0.2);
        }
        .arch-card__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(245,196,55,0.5);
          margin-left: 4px;
        }
        .arch-card__cursor {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #f5c437;
          margin-left: auto;
          animation: arch-blink 1s step-end infinite;
        }

        .arch-card__body {
          display: flex;
          padding: 24px 20px;
          gap: 16px;
        }
        .arch-card__line-nums {
          display: flex;
          flex-direction: column;
          gap: 0;
          color: rgba(245,196,55,0.2);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.75;
          user-select: none;
          min-width: 24px;
          text-align: right;
          padding-top: 2px;
        }

        .arch-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e8e6e0;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          line-height: 1.75;
          resize: none;
          min-height: 120px;
          caret-color: #f5c437;
        }
        .arch-textarea::placeholder {
          color: rgba(232,230,224,0.18);
          font-style: italic;
        }

        .arch-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-top: 1px solid rgba(245,196,55,0.08);
          background: rgba(245,196,55,0.02);
          flex-wrap: wrap;
          gap: 12px;
        }
        .arch-card__meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .arch-avatars {
          display: flex;
        }
        .arch-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(245,196,55,0.1);
          border: 2px solid #080a0f;
          margin-left: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          color: rgba(245,196,55,0.6);
        }
        .arch-avatars .arch-avatar:first-child { margin-left: 0; }
        .arch-card__count {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(232,230,224,0.3);
        }

        /* ── Button ── */
        .arch-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: #f5c437;
          color: #080a0f;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 24px rgba(245,196,55,0.3);
          white-space: nowrap;
        }
        .arch-btn:hover {
          background: #fcd94e;
          box-shadow: 0 0 40px rgba(245,196,55,0.5);
        }
        .arch-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ── Stack Section ── */
        .arch-stack__header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 36px;
        }
        .arch-stack__line {
          flex: 1;
          height: 1px;
          background: rgba(245,196,55,0.1);
        }
        .arch-stack__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: rgba(245,196,55,0.3);
          white-space: nowrap;
        }

        .arch-stack__grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .arch-tech {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border: 1px solid rgba(245,196,55,0.1);
          background: rgba(245,196,55,0.02);
          border-radius: 2px;
          transition: all 0.25s ease;
          cursor: default;
        }
        .arch-tech:hover {
          border-color: rgba(245,196,55,0.35);
          background: rgba(245,196,55,0.06);
          box-shadow: 0 0 20px rgba(245,196,55,0.1);
        }
        .arch-tech__icon-wrap {
          width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          filter: grayscale(1) brightness(0.7);
          transition: filter 0.25s ease;
        }
        .arch-tech:hover .arch-tech__icon-wrap {
          filter: grayscale(0) brightness(1);
        }
        .arch-tech__icon {
          width: 20px; height: 20px;
          object-fit: contain;
        }
        .arch-tech__name {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(245,196,55,0.4);
          transition: color 0.25s ease;
        }
        .arch-tech:hover .arch-tech__name {
          color: rgba(245,196,55,0.8);
        }
      `}</style>
    </div>
  );
};

export default Home;
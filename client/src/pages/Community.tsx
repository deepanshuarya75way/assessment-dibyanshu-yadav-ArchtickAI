import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, Sparkles, Globe, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { axiosInstance } from "@/configs/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/website-project/public/all");
      setProjects(response.data.projects);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 404) {
        toast.error(error.response?.data?.detail);
        setProjects([]);
      } else {
        toast.error(error.response?.data?.detail || "Failed to fetch community projects");
      }
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 20 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 }
    }
  };

  return (
    <div className="cm-root min-h-screen pt-32 pb-20 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .cm-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }
        .cm-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,196,55,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,196,55,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Loading ── */
        .cm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 16px;
        }
        .cm-loading svg { color: #f5c437; }
        .cm-loading__label {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.38);
        }

        /* ── Header ── */
        .cm-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.5);
          margin-bottom: 14px;
        }
        .cm-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          letter-spacing: -0.03em;
          color: #e8e6e0;
          line-height: 1;
        }
        .cm-title span {
          color: #f5c437;
          text-shadow: 0 0 40px rgba(245,196,55,0.22);
        }
        .cm-desc {
          font-size: 10px;
          line-height: 1.9;
          color: rgba(232,230,224,0.3);
          max-width: 300px;
        }

        /* ── Grid ── */
        .cm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 48px;
        }
        @media (min-width: 640px)  { .cm-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .cm-grid { grid-template-columns: repeat(3, 1fr); } }

        /* ── Card ── */
        .cm-card {
          display: block;
          text-decoration: none;
          background: rgba(10,12,18,0.92);
          border: 1px solid rgba(245,196,55,0.1);
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
        .cm-card:hover {
          border-color: rgba(245,196,55,0.3);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,196,55,0.07);
        }

        /* Thumbnail */
        .cm-thumb {
          position: relative;
          aspect-ratio: 16/9;
          background: #0c0e14;
          border-bottom: 1px solid rgba(245,196,55,0.07);
          overflow: hidden;
        }
        .cm-thumb__empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245,196,55,0.08);
          z-index: 1;
        }
        .cm-thumb__preview {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.55;
          transition: opacity 0.5s ease;
          overflow: hidden;
          z-index: 1;
        }
        .cm-thumb__preview iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 1200px;
          height: 800px;
          transform: scale(0.35);
          transform-origin: top left;
          pointer-events: none;
          border: none;
        }
        .cm-card:hover .cm-thumb__preview { opacity: 0.9; }
        .cm-thumb__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,10,15,0.75) 0%, rgba(8,10,15,0.2) 50%, transparent 100%);
          transition: opacity 0.25s ease;
          z-index: 2;
        }
        .cm-card:hover .cm-thumb__overlay { opacity: 0.5; }

        /* Version tag */
        .cm-version {
          position: absolute;
          top: 10px; right: 10px;
          padding: 4px 10px;
          border: 1px solid rgba(245,196,55,0.2);
          background: rgba(8,10,15,0.85);
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.55);
          backdrop-filter: blur(8px);
          z-index: 3;
        }

        /* Card body */
        .cm-card__body { padding: 20px; }
        .cm-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 10px;
        }
         .mp-card__name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.02em;
          color: #e8e6e0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 8px;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .cm-card:hover .cm-card__name { color: #f5c437; }
        .cm-card__prompt {
          font-size: 10px;
          line-height: 1.75;
          color: rgba(232,230,224,0.28);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 18px;
        }

        /* Card footer */
        .cm-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(245,196,55,0.07);
        }
        .cm-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cm-author__avatar {
          width: 28px; height: 28px;
          border: 1px solid rgba(245,196,55,0.2);
          background: rgba(245,196,55,0.07);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 11px;
          color: #f5c437;
          flex-shrink: 0;
        }
        .cm-author__name {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(232,230,224,0.35);
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cm-date {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.25);
        }

        /* ── Empty State ── */
        .cm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          text-align: center;
          padding: 24px;
        }
        .cm-empty__icon {
          width: 72px; height: 72px;
          border: 1px solid rgba(245,196,55,0.12);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(245,196,55,0.2);
          margin-bottom: 28px;
        }
        .cm-empty__title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 24px;
          color: #e8e6e0;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .cm-empty__sub {
          font-size: 10px;
          line-height: 1.8;
          color: rgba(232,230,224,0.3);
          max-width: 280px;
          margin-bottom: 36px;
        }
        .cm-empty__btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: #f5c437;
          color: #080a0f;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          box-shadow: 0 0 24px rgba(245,196,55,0.25);
          transition: all 0.2s ease;
        }
        .cm-empty__btn:hover { background: #fcd94e; box-shadow: 0 0 36px rgba(245,196,55,0.4); }
        .cm-empty__btn:active { transform: scale(0.97); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {loading ? (
          <div className="cm-loading">
            <Loader2Icon className="animate-spin" size={32} />
            <p className="cm-loading__label">Accessing Community Archive...</p>
          </div>
        ) : projects?.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-0">
              <div>
                <motion.div variants={itemVariants} className="cm-eyebrow">
                  <Globe size={12} />
                  <span>Global Syndicate</span>
                </motion.div>
                <motion.h1 variants={itemVariants} className="cm-title">
                  Public <span>Architectures</span>
                </motion.h1>
              </div>
              <motion.p variants={itemVariants} className="cm-desc">
                Explore AI-synthesized web experiences from the Architect syndicate.
              </motion.p>
            </div>

            {/* Grid */}
            <div className="cm-grid">
              {projects?.map((project) => (
                <motion.div
                  variants={itemVariants}
                  key={project?.id}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    className="cm-card"
                    to={`/view/${project.id}`}
                    target="_blank"
                  >
                    {/* Thumbnail */}
                    <div className="cm-thumb">
                      {project?.current_code ? (
                        <div className="cm-thumb__preview">
                          <iframe
                            srcDoc={project?.current_code}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                      ) : (
                        <div className="cm-thumb__empty">
                          <Sparkles size={40} />
                        </div>
                      )}
                      <div className="cm-thumb__overlay" />
                      <span className="cm-version">V1.0</span>
                    </div>

                    {/* Body */}
                    <div className="cm-card__body">
                      {/* <div className="cm-card__header"> */}
                      <h2 className="cm-card__name">{project?.name}</h2>
                      {/* </div> */}
                      <p className="cm-card__prompt">{project.initial_prompt}</p>

                      <div className="cm-card__footer">
                        <div className="cm-author">
                          <div className="cm-author__avatar">
                            {project.user?.name?.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="cm-author__name">{project.user?.name}</span>
                        </div>
                        <div className="cm-date">
                          <Calendar size={11} />
                          <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="cm-empty"
          >
            <div className="cm-empty__icon">
              <Sparkles size={32} />
            </div>
            <h1 className="cm-empty__title">The Syndicate is silent.</h1>
            <p className="cm-empty__sub">No architectures have been authorized for public transmission yet.</p>
            <button className="cm-empty__btn" onClick={() => navigate("/")}>
              Initiate First Build
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Community;
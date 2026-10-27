import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2Icon,
  Search,
  Plus,
  ArrowRight,
  Code2,
  Layout,
  Cpu,
  History,
  Trash2,
  ExternalLink
} from "lucide-react";
import { axiosInstance } from "@/configs/axios";
import type { Project } from "../types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Footer from "@/components/Footer";

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/website-project/all");
      setProjects(res.data.projects);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to retrieve archive.");
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      if (!window.confirm("Are you sure you want to purge this architecture?")) return;
      const response = await axiosInstance.delete(`/website-project/${projectId}`);
      toast.success(response.data.message);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to purge project.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.initial_prompt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 18,
        stiffness: 100
      }
    }
  };

  return (
    <div className="mp-root min-h-screen pt-32 pb-24 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .mp-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }

        /* Grid background */
        .mp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,196,55,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,196,55,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ── */
        .mp-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(245,196,55,0.55);
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .mp-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          letter-spacing: -0.03em;
          color: #e8e6e0;
          line-height: 1;
        }
        .mp-title span { color: #f5c437; text-shadow: 0 0 40px rgba(245,196,55,0.25); }

        /* ── Search ── */
        .mp-search-wrap {
          position: relative;
        }
        .mp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(245,196,55,0.35);
          transition: color 0.2s ease;
          pointer-events: none;
        }
        .mp-search-wrap:focus-within .mp-search-icon {
          color: rgba(245,196,55,0.7);
        }
        .mp-search {
          width: 100%;
          background: rgba(245,196,55,0.03);
          border: 1px solid rgba(245,196,55,0.14);
          border-radius: 2px;
          padding: 12px 16px 12px 44px;
          color: #e8e6e0;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .mp-search::placeholder { color: rgba(232,230,224,0.2); }
        .mp-search:focus {
          border-color: rgba(245,196,55,0.35);
          box-shadow: 0 0 0 3px rgba(245,196,55,0.06);
        }

        /* ── New Button ── */
        .mp-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
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
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 0 24px rgba(245,196,55,0.25);
          transition: all 0.2s ease;
        }
        .mp-new-btn:hover { background: #fcd94e; box-shadow: 0 0 36px rgba(245,196,55,0.4); }
        .mp-new-btn:active { transform: scale(0.97); }

        /* ── Card Grid ── */
        .mp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px)  { .mp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .mp-grid { grid-template-columns: repeat(3, 1fr); } }

        /* ── Project Card ── */
        .mp-card {
          background: rgba(10,12,18,0.92);
          border: 1px solid rgba(245,196,55,0.12);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          cursor: pointer;
        }
        .mp-card:hover {
          border-color: rgba(245,196,55,0.32);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,196,55,0.08);
          transform: translateY(-6px);
        }

        /* Thumbnail */
        .mp-thumb {
          position: relative;
          aspect-ratio: 16/9;
          background: #0c0e14;
          border-bottom: 1px solid rgba(245,196,55,0.07);
          overflow: hidden;
          cursor: pointer;
        }
        .mp-thumb__placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245,196,55,0.12);
          transition: color 0.25s ease;
        }
        .mp-card:hover .mp-thumb__placeholder { color: rgba(245,196,55,0.22); }
        .mp-thumb__preview {
          width: 100%;
          height: 100%;
          opacity: 0.4;
          transition: opacity 0.5s ease;
          pointer-events: none;
          transform: scale(0.35);
          transform-origin: top left;
        }
        .mp-card:hover .mp-thumb__preview { opacity: 0.75; }
        .mp-thumb__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,10,15,0.85) 0%, rgba(8,10,15,0.15) 60%, transparent 100%);
        }

        /* Delete button */
        .mp-delete {
          position: absolute;
          top: 12px; right: 12px;
          padding: 8px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.07);
          color: rgba(239,68,68,0.6);
          border-radius: 2px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(-4px);
          transition: all 0.2s ease;
        }
        .mp-card:hover .mp-delete {
          opacity: 1;
          transform: translateY(0);
        }
        .mp-delete:hover {
          background: rgba(239,68,68,0.2);
          color: rgba(239,68,68,1);
          border-color: rgba(239,68,68,0.4);
        }

        /* Status badge */
        .mp-status {
          position: absolute;
          bottom: 12px; left: 14px;
          padding: 4px 10px;
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-radius: 2px;
          color: #080a0f;
        }
        .mp-status--public  { background: #10b981; box-shadow: 0 0 12px rgba(16,185,129,0.4); }
        .mp-status--private { background: #f5c437; box-shadow: 0 0 12px rgba(245,196,55,0.4); }

        /* Card body */
        .mp-card__body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
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
        .mp-card:hover .mp-card__name { color: #f5c437; }
        .mp-card__prompt {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          line-height: 1.7;
          color: rgba(232,230,224,0.3);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          margin-bottom: 18px;
        }

        /* Card footer */
        .mp-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(245,196,55,0.07);
        }
        .mp-card__date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(245,196,55,0.3);
          text-transform: uppercase;
        }
        .mp-card__actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mp-icon-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(245,196,55,0.12);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          color: rgba(245,196,55,0.4);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .mp-icon-btn:hover {
          border-color: rgba(245,196,55,0.3);
          color: #f5c437;
          background: rgba(245,196,55,0.07);
        }
        .mp-icon-btn:active { transform: scale(0.92); }
        .mp-icon-btn--primary {
          background: #f5c437;
          border-color: #f5c437;
          color: #080a0f;
          box-shadow: 0 0 16px rgba(245,196,55,0.25);
        }
        .mp-icon-btn--primary:hover {
          background: #fcd94e;
          color: #080a0f;
          box-shadow: 0 0 24px rgba(245,196,55,0.4);
        }

        /* ── Create New Card ── */
        .mp-new-card {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(245,196,55,0.15);
          border-radius: 4px;
          background: transparent;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .mp-new-card:hover {
          border-color: rgba(245,196,55,0.35);
          background: rgba(245,196,55,0.03);
          box-shadow: 0 0 40px rgba(245,196,55,0.06);
        }
        .mp-new-card__icon {
          width: 56px; height: 56px;
          border: 1px solid rgba(245,196,55,0.2);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(245,196,55,0.4);
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }
        .mp-new-card:hover .mp-new-card__icon {
          background: #f5c437;
          border-color: #f5c437;
          color: #080a0f;
          box-shadow: 0 0 28px rgba(245,196,55,0.35);
        }
        .mp-new-card__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.3);
          transition: color 0.3s ease;
        }
        .mp-new-card:hover .mp-new-card__label { color: rgba(245,196,55,0.7); }

        /* ── Loading ── */
        .mp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 16px;
        }
        .mp-loading__spinner { color: #f5c437; }
        .mp-loading__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.35);
        }

        /* ── Empty State ── */
        .mp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }
        .mp-empty__icon {
          width: 72px; height: 72px;
          border: 1px solid rgba(245,196,55,0.12);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(245,196,55,0.2);
          margin-bottom: 28px;
        }
        .mp-empty__title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #e8e6e0;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .mp-empty__sub {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          line-height: 1.8;
          color: rgba(232,230,224,0.3);
          max-width: 280px;
          margin-bottom: 36px;
        }
        .mp-empty__btn {
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
          border-radius: 2px;
          text-decoration: none;
          box-shadow: 0 0 24px rgba(245,196,55,0.25);
          transition: all 0.2s ease;
        }
        .mp-empty__btn:hover { background: #fcd94e; box-shadow: 0 0 36px rgba(245,196,55,0.4); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="mp-eyebrow"
          >
            <Cpu size={12} />
            <span>Architecture Vault</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mp-title"
            >
              My <span>Projects</span>
            </motion.h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mp-search-wrap w-full sm:w-72"
              >
                <Search className="mp-search-icon" size={15} />
                <input
                  type="text"
                  placeholder="Search archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mp-search"
                />
              </motion.div>

              <Link to="/" className="mp-new-btn">
                <Plus size={14} />
                INITIATE NEW
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="mp-loading">
            <Loader2Icon className="mp-loading__spinner animate-spin" size={32} />
            <p className="mp-loading__label">Decrypting Archive...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mp-grid"
          >
            {filteredProjects.map((project) => (
              <motion.div variants={itemVariants} key={project.id} className="mp-card">

                {/* Thumbnail */}
                <div className="mp-thumb" onClick={() => navigate(`/projects/${project.id}`)}>
                  <div className="mp-thumb__placeholder">
                    <Layout size={52} />
                  </div>
                  {project.current_code && (
                    <div className="mp-thumb__preview">
                      <iframe srcDoc={project.current_code} className="w-[1200px] h-[800px]" />
                    </div>
                  )}
                  <div className="mp-thumb__overlay" />

                  <button
                    className="mp-delete"
                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  >
                    <Trash2 size={14} />
                  </button>

                  <span className={`mp-status ${project.is_published ? "mp-status--public" : "mp-status--private"}`}>
                    {project.is_published ? "PUBLIC" : "PRIVATE"}
                  </span>
                </div>

                {/* Body */}
                <div className="mp-card__body">
                  <h2
                    className="mp-card__name"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.name}
                  </h2>
                  <p className="mp-card__prompt">{project.initial_prompt}</p>

                  <div className="mp-card__footer">
                    <div className="mp-card__date">
                      <History size={11} />
                      <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="mp-card__actions">
                      <Link to={`/preview/${project.id}`} className="mp-icon-btn">
                        <ExternalLink size={14} />
                      </Link>
                      <Link to={`/projects/${project.id}`} className="mp-icon-btn mp-icon-btn--primary">
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Create New */}
            <motion.div variants={itemVariants}>
              <Link to="/" className="mp-new-card">
                <div className="mp-new-card__icon">
                  <Plus size={24} />
                </div>
                <span className="mp-new-card__label">Initialize New Blueprint</span>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mp-empty"
          >
            <div className="mp-empty__icon">
              <Code2 size={36} />
            </div>
            <h2 className="mp-empty__title">The Archive is empty.</h2>
            <p className="mp-empty__sub">You haven't synthesized any architectures yet. The forge awaits.</p>
            <Link to="/" className="mp-empty__btn">
              <Plus size={14} />
              Craft Your First Site
            </Link>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyProjects;
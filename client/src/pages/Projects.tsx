import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Project } from "../types";
import {
  Loader2Icon,
  EyeOffIcon,
  FullscreenIcon,
  LaptopIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
  ArrowDownToLine,
  ChevronLeft,
  Share2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProjectPreview, {
  type ProjectPreviewReference,
} from "../components/ProjectPreview";
import { axiosInstance } from "@/configs/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState<"desktop" | "phone" | "tablet">("desktop");
  const [isMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<ProjectPreviewReference>(null);

  const fetchProjectData = async () => {
    try {
      const response = await axiosInstance.get(`/website-project/${projectId}`);
      setProject(response.data.project);
      setIsGenerating(response.data.project.current_code ? false : true);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch project data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectData();
    } else {
      navigate("/");
      toast.error("Authentication required for building.");
    }
  }, [isAuthenticated, projectId]);

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(() => { fetchProjectData(); }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [project]);

  const saveProject = async () => {
    if (!previewRef.current) return;
    const code = previewRef.current.getcode();
    if (!code) return;
    try {
      setIsSaving(true);
      await axiosInstance.put(`/website-project/save/${projectId}`, { code });
      toast.success("Architecture state preserved.");
      setIsSaving(false);
    } catch (error) {
      toast.error("Failed to preserve architecture.");
      setIsSaving(false);
    }
  };

  const downloadCode = async () => {
    const code = previewRef.current?.getcode() || project?.current_code;
    if (!code) return;
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${project?.name || "architecture"}.html`;
    document.body.appendChild(element);
    element.click();
  };

  const togglePublish = async () => {
    try {
      await axiosInstance.post(`/website-project/publish/${projectId}`);
      toast.success(project?.is_published ? "Project restricted to private." : "Project authorized for public viewing.");
      setProject((prev) => prev ? { ...prev, is_published: !prev.is_published } : null);
    } catch (error) {
      toast.error("Failed to modify authorization level.");
    }
  };

  if (loading) {
    return (
      <div className="pb-loading-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');
          .pb-loading-screen {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            height: 100vh;
            background: #080a0f;
            gap: 16px;
            font-family: 'Space Mono', monospace;
          }
          .pb-loading-screen svg { color: #f5c437; }
          .pb-loading-label {
            font-size: 9px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: rgba(245,196,55,0.4);
          }
        `}</style>
        <Loader2Icon className="animate-spin" size={32} />
        <p className="pb-loading-label">Initializing Build Environment...</p>
      </div>
    );
  }

  return project ? (
    <div className="pb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .pb-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }

        /* ── Header ── */
        .pb-header {
          height: 62px;
          border-bottom: 1px solid rgba(245,196,55,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: rgba(8,10,15,0.96);
          backdrop-filter: blur(20px);
          z-index: 100;
          flex-shrink: 0;
          gap: 12px;
        }

        /* Left section */
        .pb-header__left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .pb-back-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(245,196,55,0.14);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          color: rgba(245,196,55,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pb-back-btn:hover {
          border-color: rgba(245,196,55,0.35);
          color: #f5c437;
          background: rgba(245,196,55,0.08);
        }
        .pb-project-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: -0.01em;
          color: #e8e6e0;
          line-height: 1;
          margin-bottom: 3px;
          text-transform: uppercase;
        }
        .pb-status-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pb-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px rgba(16,185,129,0.6);
          animation: pb-pulse 2s ease-in-out infinite;
        }
        @keyframes pb-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .pb-status-label {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(16,185,129,0.6);
        }

        /* Device switcher */
        .pb-device-switcher {
          display: none;
          align-items: center;
          gap: 2px;
          padding: 4px;
          border: 1px solid rgba(245,196,55,0.1);
          background: rgba(245,196,55,0.02);
          border-radius: 2px;
        }
        @media (min-width: 1024px) { .pb-device-switcher { display: flex; } }

        .pb-device-btn {
          padding: 7px 10px;
          border-radius: 2px;
          border: none;
          background: transparent;
          color: rgba(245,196,55,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pb-device-btn:hover { color: rgba(245,196,55,0.6); }
        .pb-device-btn--active {
          background: #f5c437 !important;
          color: #080a0f !important;
          box-shadow: 0 0 12px rgba(245,196,55,0.3);
        }

        /* Right actions */
        .pb-header__right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .pb-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid rgba(245,196,55,0.12);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          color: rgba(232,230,224,0.45);
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pb-action-btn:hover {
          border-color: rgba(245,196,55,0.28);
          color: rgba(245,196,55,0.8);
          background: rgba(245,196,55,0.05);
        }
        .pb-action-btn:active { transform: scale(0.97); }
        .pb-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .pb-sep {
          width: 1px; height: 28px;
          background: rgba(245,196,55,0.08);
        }

        /* Publish button */
        .pb-publish-btn--public {
          border-color: rgba(16,185,129,0.25) !important;
          background: rgba(16,185,129,0.07) !important;
          color: rgba(16,185,129,0.7) !important;
        }
        .pb-publish-btn--public:hover {
          border-color: rgba(16,185,129,0.45) !important;
          color: rgba(16,185,129,1) !important;
          background: rgba(16,185,129,0.12) !important;
        }
        .pb-publish-btn--private {
          border-color: rgba(245,196,55,0.3) !important;
          background: #f5c437 !important;
          color: #080a0f !important;
          box-shadow: 0 0 16px rgba(245,196,55,0.25);
        }
        .pb-publish-btn--private:hover {
          background: #fcd94e !important;
          box-shadow: 0 0 24px rgba(245,196,55,0.4);
        }

        /* Download */
        .pb-download-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(245,196,55,0.2);
          background: rgba(245,196,55,0.06);
          border-radius: 2px;
          color: #f5c437;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pb-download-btn:hover {
          background: #f5c437;
          color: #080a0f;
          box-shadow: 0 0 16px rgba(245,196,55,0.3);
        }
        .pb-download-btn:active { transform: scale(0.92); }

        /* ── Main Layout ── */
        .pb-main {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* Sidebar column */
        .pb-sidebar-col {
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(245,196,55,0.08);
          background: rgba(8,10,15,0.7);
          backdrop-filter: blur(16px);
        }
        @media (min-width: 1280px) { .pb-sidebar-col { width: 420px; } }

        /* Preview column */
        .pb-preview-col {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050810;
          padding: 16px;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .pb-preview-col { padding: 48px; } }

        /* Preview grid */
        .pb-preview-col::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,196,55,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,196,55,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Version tag */
        .pb-version-tag {
          position: absolute;
          bottom: 20px; right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: rgba(8,10,15,0.9);
          border: 1px solid rgba(245,196,55,0.1);
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.35);
          backdrop-filter: blur(12px);
          z-index: 10;
        }
        .pb-version-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px rgba(16,185,129,0.5);
        }

        /* ── Not Found ── */
        .pb-not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          text-align: center;
          padding: 24px;
        }
        .pb-not-found__icon {
          width: 72px; height: 72px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.05);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(239,68,68,0.5);
          margin-bottom: 28px;
        }
        .pb-not-found__title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #e8e6e0;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .pb-not-found__sub {
          font-size: 10px;
          line-height: 1.8;
          color: rgba(232,230,224,0.3);
          margin-bottom: 36px;
          max-width: 300px;
        }
        .pb-not-found__btn {
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
        .pb-not-found__btn:hover { background: #fcd94e; }
      `}</style>

      {/* Header */}
      <header className="pb-header">
        <div className="pb-header__left">
          <button onClick={() => navigate("/projects")} className="pb-back-btn">
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="pb-project-name">{project.name}</p>
            <div className="pb-status-row">
              <div className="pb-status-dot" />
              <span className="pb-status-label">Build Mode Active</span>
            </div>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="pb-device-switcher">
          {[
            { id: "desktop", icon: LaptopIcon },
            { id: "tablet", icon: TabletIcon },
            { id: "phone", icon: SmartphoneIcon }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDevice(item.id as any)}
              className={`pb-device-btn ${device === item.id ? "pb-device-btn--active" : ""}`}
            >
              <item.icon size={16} />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="pb-header__right">
          <Link
            target="_blank"
            to={`/preview/${projectId}`}
            className="pb-action-btn"
          >
            <FullscreenIcon size={13} />
            <span className="hidden sm:inline">Fullscreen</span>
          </Link>

          <button
            onClick={saveProject}
            disabled={isSaving}
            className="pb-action-btn"
          >
            {isSaving
              ? <Loader2Icon size={13} className="animate-spin" />
              : <SaveIcon size={13} />
            }
            <span className="hidden sm:inline">Persist</span>
          </button>

          <div className="pb-sep" />

          <button
            onClick={togglePublish}
            className={`pb-action-btn ${project.is_published ? "pb-publish-btn--public" : "pb-publish-btn--private"}`}
          >
            {project.is_published ? <EyeOffIcon size={13} /> : <Share2 size={13} />}
            <span className="hidden sm:inline">
              {project.is_published ? "Revoke" : "Publish"}
            </span>
          </button>

          <button onClick={downloadCode} className="pb-download-btn" title="Download">
            <ArrowDownToLine size={16} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="pb-main">
        <div className="pb-sidebar-col">
          <Sidebar
            isMenuOpen={isMenuOpen}
            project={project}
            setProject={(p) => setProject(p)}
            isGenerating={isGenerating}
            setIsGenerating={(p) => setIsGenerating(p)}
          />
        </div>

        <div className="pb-preview-col">
          <div style={{ width: "100%", height: "100%", maxWidth: "1280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ProjectPreview
              ref={previewRef}
              project={project}
              isGenerating={isGenerating}
              device={device}
            />
          </div>

          <div className="pb-version-tag">
            <div className="pb-version-dot" />
            Last Sync: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </main>
    </div>
  ) : (
    <div className="pb-not-found">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@800&display=swap');
        .pb-not-found { font-family: 'Space Mono', monospace; }
      `}</style>
      <div className="pb-not-found__icon">
        <XIcon size={36} />
      </div>
      <h1 className="pb-not-found__title">Architecture Not Found</h1>
      <p className="pb-not-found__sub">This blueprint has been purged or never existed within the archive.</p>
      <button onClick={() => navigate("/")} className="pb-not-found__btn">
        Return to Forge
      </button>
    </div>
  );
};

export default Projects;
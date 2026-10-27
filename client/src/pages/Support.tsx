import { useNavigate } from "react-router-dom";
import { 
  LifeBuoy, 
  MessageCircle, 
  FileText, 
  ShieldCheck, 
  Mail, 
  Twitter, 
  Github,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const Support = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: <LifeBuoy size={20} className="text-[#f5c437]" />,
      title: "Help Center",
      label: "GUIDE_MODULE",
      description: "Browse our comprehensive guides and tutorials to get started.",
      link: "#"
    },
    {
      icon: <MessageCircle size={20} className="text-[#f5c437]" />,
      title: "Community Area",
      label: "COMM_CHANNEL",
      description: "Ask questions and share tips with other website architects.",
      link: "/community"
    },
    {
      icon: <FileText size={20} className="text-[#f5c437]" />,
      title: "Docs / API",
      label: "TECH_SPECS",
      description: "In-depth technical specs for advanced synthesis control.",
      link: "#"
    },
    {
      icon: <ShieldCheck size={20} className="text-[#f5c437]" />,
      title: "Protocol Sec",
      label: "SEC_LAYER",
      description: "Learn how we protect your data and website assets.",
      link: "#"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, damping: 25, stiffness: 120 }
    }
  };

  return (
    <div className="arch-root relative min-h-screen pt-40 pb-20 overflow-hidden">
      {/* Blueprint elements */}
      <div className="arch-grid" aria-hidden="true" />
      <div className="arch-horizon" aria-hidden="true" />
      <div className="arch-corner arch-corner--tl" aria-hidden="true" />
      <div className="arch-corner arch-corner--tr" aria-hidden="true" />
      <div className="arch-corner arch-corner--bl" aria-hidden="true" />
      <div className="arch-corner arch-corner--br" aria-hidden="true" />
      <div className="arch-ambient" aria-hidden="true" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6"
      >
        {/* Header Section */}
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div variants={itemVariants} className="arch-badge mb-8">
            <LifeBuoy size={12} className="text-[#f5c437]" />
            <span className="arch-badge__label uppercase">Support Hub</span>
            <span className="arch-badge__sep">·</span>
            <span className="arch-badge__sub uppercase">v4.0.2-ALPHA</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="arch-title mb-8">
            <span className="arch-title__line">System</span>
            <span className="arch-title__accent">Diagnostic / Assistance</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="arch-subtitle max-w-2xl text-center">
            Find answers, synchronize with the community, or initialize a direct support protocol. 
            Our engineering team is standing by to resolve any synthesis anomalies.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              onClick={() => cat.link.startsWith("/") && navigate(cat.link)}
              className="arch-card group cursor-pointer"
            >
              <div className="arch-card__topbar">
                <div className="arch-card__dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="arch-card__label uppercase">{cat.label}</span>
              </div>
              <div className="arch-card__body p-8 bg-[#0a0c12]/80 group-hover:bg-[#0a0c12]/95 transition-colors">
                <div className="mb-6 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-sm font-bold tracking-wider mb-3 text-[#e8e6e0]">{cat.title}</h3>
                <p className="arch-subtitle text-[10px] leading-relaxed mb-6 group-hover:text-[#e8e6e0]/60 transition-colors">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 text-[8px] font-bold text-[#f5c437] tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-all">
                  INITIALIZE <ArrowLeft size={10} className="rotate-180" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={itemVariants}>
            <div className="arch-stack__header !mb-8">
              <div className="arch-stack__line" />
              <span className="arch-stack__label">DIRECT_PROTOCOL</span>
              <div className="arch-stack__line" />
            </div>
            
            <h2 className="arch-title text-left text-4xl mb-6">Unresolved <span className="text-[#f5c437]">Anomalies?</span></h2>
            <p className="arch-subtitle mb-10 max-w-lg">
              If our documentation modules fail to provide resolution, our support team is available 24/7 
              for deep-level troubleshooting and system audit.
            </p>
            
            <div className="space-y-6">
              <a href="mailto:support@architect.io" className="arch-card flex items-center gap-5 p-5 bg-[#0a0c12]/40 hover:bg-[#f5c437]/05 transition-colors group">
                <div className="p-3 bg-[#f5c437]/10 text-[#f5c437] group-hover:bg-[#f5c437] group-hover:text-[#080a0f] transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[#f5c437]/60 font-bold tracking-widest uppercase mb-1">Email Terminal</p>
                  <p className="text-sm text-[#e8e6e0] font-medium">support@architect.io</p>
                </div>
              </a>

              <div className="flex items-center gap-6">
                <div className="flex gap-3">
                  {[Twitter, Github].map((Icon, i) => (
                    <a key={i} href="#" className="p-3 border border-[#f5c437]/20 text-[#f5c437]/60 hover:text-[#f5c437] hover:border-[#f5c437]/60 transition-all">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
                <span className="text-[9px] text-[#f5c437]/30 font-bold tracking-widest uppercase">Social Channels</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="arch-card !p-0">
            <div className="arch-card__topbar">
              <div className="arch-card__dots">
                <span style={{ background: "#f5c437" }} />
                <span />
                <span />
              </div>
              <span className="arch-card__label uppercase">TRANSMIT_CONSOLE</span>
            </div>
            <div className="p-8 bg-[#0a0c12]/95">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] text-[#f5c437]/40 font-bold tracking-widest uppercase ml-1">Architect</label>
                    <input type="text" placeholder="NAME_ID" className="arch-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] text-[#f5c437]/40 font-bold tracking-widest uppercase ml-1">Protocol</label>
                    <input type="email" placeholder="EMAIL_ADDR" className="arch-input" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-[#f5c437]/40 font-bold tracking-widest uppercase ml-1">Subject</label>
                  <input type="text" placeholder="LOG_HEADER" className="arch-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-[#f5c437]/40 font-bold tracking-widest uppercase ml-1">Message</label>
                  <textarea placeholder="DESCRIBE_ANOMALY..." rows={4} className="arch-input resize-none"></textarea>
                </div>
                <button className="arch-btn w-full justify-center group mt-4">
                  <span>TRANSMIT DATA</span>
                  <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .arch-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }

        .arch-input {
          width: 100%;
          background: rgba(245,196,55,0.02);
          border: 1px solid rgba(245,196,55,0.1);
          border-radius: 2px;
          padding: 12px 16px;
          color: #e8e6e0;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          transition: all 0.2s ease;
        }
        .arch-input:focus {
          outline: none;
          border-color: rgba(245,196,55,0.4);
          background: rgba(245,196,55,0.05);
          box-shadow: 0 0 20px rgba(245,196,55,0.05);
        }

        /* Essential arch styles */
        .arch-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(245,196,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,196,55,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .arch-horizon {
          position: fixed; top: 50%; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,196,55,0.12), transparent);
          z-index: 0; pointer-events: none;
        }

        .arch-corner {
          position: fixed; width: 40px; height: 40px; z-index: 1; pointer-events: none;
        }
        .arch-corner::before, .arch-corner::after {
          content: ''; position: absolute; background: rgba(245,196,55,0.35);
        }
        .arch-corner--tl { top: 24px; left: 24px; }
        .arch-corner--tl::before { top: 0; left: 0; width: 100%; height: 1px; }
        .arch-corner--tl::after  { top: 0; left: 0; height: 100%; width: 1px; }
        .arch-corner--tr { top: 24px; right: 24px; }
        .arch-corner--tr::before { top: 0; right: 0; width: 100%; height: 1px; }
        .arch-corner--tr::after  { top: 0; right: 0; height: 100%; width: 1px; }
        .arch-corner--bl { bottom: 24px; left: 24px; }
        .arch-corner--bl::before { bottom: 0; left: 0; width: 100%; height: 1px; }
        .arch-corner--bl::after  { bottom: 0; left: 0; height: 100%; width: 1px; }
        .arch-corner--br { bottom: 24px; right: 24px; }
        .arch-corner--br::before { bottom: 0; right: 0; width: 100%; height: 1px; }
        .arch-corner--br::after  { bottom: 0; right: 0; height: 100%; width: 1px; }

        .arch-ambient {
          position: fixed; top: -20%; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px;
          background: radial-gradient(ellipse, rgba(245,196,55,0.06) 0%, transparent 65%);
          z-index: 0; pointer-events: none;
        }

        .arch-badge {
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
          border: 1px solid rgba(245,196,55,0.3); background: rgba(245,196,55,0.04);
          color: #f5c437; border-radius: 2px;
        }
        .arch-badge__label { font-size: 9px; letter-spacing: 0.18em; }
        .arch-badge__sep { opacity: 0.4; }
        .arch-badge__sub { opacity: 0.6; font-size: 9px; }

        .arch-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1;
          letter-spacing: -0.02em; text-align: center;
        }
        .arch-title__accent {
          color: #f5c437; display: block; text-shadow: 0 0 40px rgba(245,196,55,0.3);
        }

        .arch-subtitle {
          font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8;
          color: rgba(232,230,224,0.5); letter-spacing: 0.05em;
        }

        .arch-card {
          background: rgba(10,12,18,0.9); border: 1px solid rgba(245,196,55,0.18);
          border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          overflow: hidden; transition: all 0.3s ease;
        }
        .arch-card:hover { border-color: rgba(245,196,55,0.35); box-shadow: 0 30px 80px rgba(0,0,0,0.8); }

        .arch-card__topbar {
          display: flex; align-items: center; gap: 10px; padding: 10px 16px;
          border-bottom: 1px solid rgba(245,196,55,0.08); background: rgba(245,196,55,0.02);
        }
        .arch-card__dots { display: flex; gap: 5px; }
        .arch-card__dots span {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(245,196,55,0.15); border: 1px solid rgba(245,196,55,0.2);
        }
        .arch-card__label { font-size: 8px; letter-spacing: 0.2em; color: rgba(245,196,55,0.4); }

        .arch-stack__header { display: flex; align-items: center; gap: 12px; }
        .arch-stack__line { flex: 1; height: 1px; background: rgba(245,196,55,0.1); }
        .arch-stack__label { font-size: 8px; letter-spacing: 0.25em; color: rgba(245,196,55,0.3); }

        .arch-btn {
          display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px;
          background: #f5c437; color: #080a0f; font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; border: none; border-radius: 2px;
          cursor: pointer; box-shadow: 0 0 20px rgba(245,196,55,0.2); transition: all 0.2s ease;
        }
        .arch-btn:hover { background: #fcd94e; box-shadow: 0 0 30px rgba(245,196,55,0.4); }
      `}</style>
    </div>
  );
};

export default Support;

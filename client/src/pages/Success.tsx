import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2, XCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../configs/axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchCredits } from "../redux/profileSlice";
import type { AppDispatch } from "../redux/store";
import Footer from "../components/Footer";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setVerifying(false);
        setError("Missing Order ID");
        return;
      }
      try {
        const response = await axiosInstance.get(`/payment/verify-payment/${orderId}`);
        if (response.data.status === "SUCCESS") {
          toast.success("Payment verified! Credits added.");
          dispatch(fetchCredits());
        } else if (response.data.error) {
          setError(response.data.error);
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setError("Automatic verification failed. Please contact support if credits aren't added.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();

    const timer = setTimeout(() => {
      navigate("/");
    }, 12000);

    return () => clearTimeout(timer);
  }, [navigate, orderId, dispatch]);

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
    <div className="arch-root relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden px-4">
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
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <div className="arch-card overflow-hidden">
          <div className="arch-card__topbar">
            <div className="arch-card__dots">
              <span style={{ background: verifying ? "#f5c437" : (error ? "#ff4444" : "#f5c437") }} />
              <span />
              <span />
            </div>
            <span className="arch-card__label uppercase">
              {verifying ? "VERIFYING_PROTOCOL" : (error ? "PROTOCOL_ERROR" : "SYNTHESIS_COMPLETE")}
            </span>
          </div>

          <div className="arch-card__body p-10 bg-[#0a0c12]/95 text-center">
            <AnimatePresence mode="wait">
              {verifying ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 border border-[#f5c437]/20 bg-[#f5c437]/05 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(245,196,55,0.05)]">
                    <Loader2 className="w-10 h-10 text-[#f5c437] animate-spin" />
                  </div>
                  <h2 className="arch-title text-3xl mb-4">Architecting <span className="text-[#f5c437]">Verification</span></h2>
                  <p className="arch-subtitle uppercase text-[10px] tracking-widest mt-2">Connecting to secure gateway</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 border border-red-500/20 bg-red-500/05 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="arch-title text-3xl mb-4"><span className="text-red-500 italic">Anomaly Detected</span></h2>
                  <p className="arch-subtitle text-[11px] leading-relaxed max-w-xs mx-auto">{error}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 border border-[#f5c437]/30 bg-[#f5c437]/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,196,55,0.1)]">
                    <CheckCircle2 className="w-10 h-10 text-[#f5c437]" />
                  </div>
                  <h1 className="arch-title text-4xl mb-4">
                    <span className="arch-title__accent">Protocol Successful</span>
                  </h1>
                  <p className="arch-subtitle text-[11px] font-medium leading-relaxed max-w-xs mx-auto">
                    System internal: Transfer complete. Your credits have been successfully infused into your Architecture ID.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 space-y-6">
              <div className="h-1 w-full bg-[#f5c437]/05 rounded-full overflow-hidden border border-[#f5c437]/10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 12, ease: "linear" }}
                  className="h-full bg-[#f5c437] shadow-[0_0_10px_rgba(245,196,55,0.5)]"
                />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f5c437]/40">
                Auto-redirecting to control dashboard
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="arch-btn w-full justify-center group mt-10"
            >
              <span>RETURN TO TERMINAL</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              <Sparkles size={12} className="group-hover:rotate-12 transition-transform opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .arch-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }

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

        .arch-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          line-height: 1.1; letter-spacing: -0.02em;
        }
        .arch-title__accent {
          color: #f5c437; text-shadow: 0 0 30px rgba(245,196,55,0.3);
        }

        .arch-subtitle {
          font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8;
          color: rgba(232,230,224,0.5); letter-spacing: 0.05em;
        }

        .arch-card {
          background: rgba(10,12,18,0.9); border: 1px solid rgba(245,196,55,0.18);
          border-radius: 4px; box-shadow: 0 30px 100px rgba(0,0,0,0.8);
        }

        .arch-card__topbar {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px;
          border-bottom: 1px solid rgba(245,196,55,0.08); background: rgba(245,196,55,0.02);
        }
        .arch-card__dots { display: flex; gap: 5px; }
        .arch-card__dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(245,196,55,0.15); border: 1px solid rgba(245,196,55,0.2);
        }
        .arch-card__label { font-size: 8px; letter-spacing: 0.25em; color: rgba(245,196,55,0.4); font-weight: 700; }

        .arch-btn {
          display: inline-flex; align-items: center; gap: 12px; padding: 16px 28px;
          background: #f5c437; color: #080a0f; font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; border: none; border-radius: 2px;
          cursor: pointer; box-shadow: 0 0 30px rgba(245,196,55,0.2); transition: all 0.3s ease;
        }
        .arch-btn:hover { background: #fcd94e; box-shadow: 0 0 40px rgba(245,196,55,0.4); }
      `}</style>
    </div>
  );
};

export default Success;

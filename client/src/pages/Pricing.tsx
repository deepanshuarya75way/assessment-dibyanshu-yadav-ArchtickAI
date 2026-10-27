import { useState } from "react";
import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";
import { load } from "@cashfreepayments/cashfree-js";
import { axiosInstance } from "../configs/axios";
import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const [plans] = useState<Plan[]>(appPlans);

  const handlePurchase = async (planId: string) => {
    try {
      const plan = plans.find((p: Plan) => p.id === planId);
      if (!plan) return;

      const amount = parseFloat(plan.price.replace("$", ""));

      const response = await axiosInstance.post("/payment/create-order", {
        plan_id: plan.id,
        amount: amount,
        credits: plan.credits,
      });

      const { payment_session_id } = response.data;

      const cashfree = await load({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: payment_session_id,
        returnUrl: `${window.location.origin}/payment-success?order_id=${response.data.order_id}`,
      });
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 }
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
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div variants={itemVariants} className="arch-badge mb-8">
            <Crown size={12} className="text-[#f5c437]" />
            <span className="arch-badge__label uppercase">Service Tiers</span>
            <span className="arch-badge__sep">·</span>
            <span className="arch-badge__sub uppercase">Transparent Credits</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="arch-title mb-6">
            <span className="arch-title__line">Scale Your</span>
            <span className="arch-title__accent"> Digital Legacy</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="arch-subtitle max-w-2xl text-center">
            Choose the perfect plan to fuel your creativity. From hobbyists to professional architects, 
            we provide the synthesis engine for your vision.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="arch-card flex flex-col h-full"
            >
              {/* Card Header/Console Bar */}
              <div className="arch-card__topbar">
                <div className="arch-card__dots">
                  <span />
                  <span />
                  <span 
                    style={{ 
                      background: idx === 1 ? "#f5c437" : "rgba(245,196,55,0.15)",
                      borderColor: idx === 1 ? "#f5c437" : "rgba(245,196,55,0.2)"
                    }} 
                  />
                </div>
                <span className="arch-card__label uppercase">{plan.name}_CONFIG</span>
                {idx === 1 && <span className="arch-card__label ml-auto" style={{ color: "#f5c437" }}>RECOMMENDED</span>}
              </div>

              {/* Card Body */}
              <div className="arch-card__body flex-1 flex flex-col p-8 bg-[#0a0c12]/90">
                <div className="mb-10 text-center">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-[#e8e6e0]">{plan.price}</span>
                    <span className="arch-subtitle uppercase">/ {plan.credits} CR</span>
                  </div>
                  <p className="arch-subtitle text-[10px] uppercase opacity-60">System Credits</p>
                </div>

                <div className="flex-1 mb-10">
                  <div className="arch-stack__header !mb-6">
                    <div className="arch-stack__line" />
                    <span className="arch-stack__label">MODULES</span>
                    <div className="arch-stack__line" />
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 w-1.5 h-1.5 border border-[#f5c437]/40 bg-[#f5c437]/10 flex-shrink-0" />
                        <span className="arch-subtitle text-[11px] leading-tight text-[#e8e6e0]/80">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="arch-btn w-full justify-center group"
                >
                  <span>ACTIVATE MODULE</span>
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pro Tip Box */}
        <motion.div 
          variants={itemVariants}
          className="arch-card max-w-2xl mx-auto mb-20"
        >
          <div className="px-6 py-5 flex items-center gap-4 bg-[#f5c437]/05 border-l-2 border-[#f5c437]">
            <Sparkles size={18} className="text-[#f5c437] shrink-0" />
            <p className="arch-subtitle text-[11px] leading-relaxed m-0 italic">
              <span className="text-[#f5c437] font-bold uppercase not-italic">Diagnostic Result:</span> Creating or revising a project consumes 5 credits. 
              Credits are stored in your Architecture ID and never expire.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        .arch-root {
          background: #080a0f;
          font-family: 'Space Mono', monospace;
          color: #e8e6e0;
        }

        /* Use existing arch styles from Home.tsx - repeated here for local scoping or ensured presence */
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

        .arch-horizon {
          position: fixed;
          top: 50%;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,196,55,0.12), transparent);
          z-index: 0;
          pointer-events: none;
        }

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
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px; height: 600px;
          background: radial-gradient(ellipse, rgba(245,196,55,0.06) 0%, transparent 65%);
          z-index: 0;
          pointer-events: none;
        }

        .arch-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid rgba(245,196,55,0.3);
          background: rgba(245,196,55,0.04);
          color: #f5c437;
          border-radius: 2px;
        }
        .arch-badge__label { font-size: 9px; letter-spacing: 0.18em; }
        .arch-badge__sep { opacity: 0.4; }
        .arch-badge__sub { opacity: 0.6; font-size: 9px; }

        .arch-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 1;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .arch-title__accent {
          color: #f5c437;
          display: block;
          text-shadow: 0 0 40px rgba(245,196,55,0.3);
        }

        .arch-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(232,230,224,0.5);
          letter-spacing: 0.05em;
        }

        .arch-card {
          background: rgba(10,12,18,0.9);
          border: 1px solid rgba(245,196,55,0.18);
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .arch-card:hover {
          border-color: rgba(245,196,55,0.35);
          box-shadow: 0 30px 80px rgba(0,0,0,0.8);
        }

        .arch-card__topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(245,196,55,0.08);
          background: rgba(245,196,55,0.02);
        }
        .arch-card__dots { display: flex; gap: 5px; }
        .arch-card__dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(245,196,55,0.15);
          border: 1px solid rgba(245,196,55,0.2);
        }
        .arch-card__label {
          font-size: 8px;
          letter-spacing: 0.2em;
          color: rgba(245,196,55,0.4);
        }

        .arch-stack__header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .arch-stack__line { flex: 1; height: 1px; background: rgba(245,196,55,0.1); }
        .arch-stack__label {
          font-size: 8px;
          letter-spacing: 0.25em;
          color: rgba(245,196,55,0.3);
        }

        .arch-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: #f5c437;
          color: #080a0f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(245,196,55,0.2);
          transition: all 0.2s ease;
        }
        .arch-btn:hover {
          background: #fcd94e;
          box-shadow: 0 0 30px rgba(245,196,55,0.4);
        }
      `}</style>
    </div>
  );
};

export default Pricing;

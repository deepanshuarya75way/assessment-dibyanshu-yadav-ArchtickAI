import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { useNavigate, Link } from "react-router-dom";
import { Loader2Icon, Mail, Lock, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="arch-root relative min-h-screen overflow-hidden flex items-center justify-center px-4">

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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="arch-card w-full max-w-md relative z-10"
            >
                {/* Card top bar */}
                <div className="arch-card__topbar">
                    <div className="arch-card__dots">
                        <span /><span /><span />
                    </div>
                    <span className="arch-card__label">AUTHENTICATION_GATE</span>
                    <span className="arch-card__cursor">_</span>
                </div>

                <div className="arch-card__body p-0 flex-col">
                    <div className="p-8 md:p-10 pb-0">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="inline-flex arch-badge mb-6"
                            >
                                <span className="arch-badge__dot" />
                                <span className="arch-badge__label">NODE_AUTH_L01</span>
                                <span className="arch-badge__sep">·</span>
                                <span className="arch-badge__sub">SYSTEM_ACTIVE</span>
                            </motion.div>
                            <h2 className="arch-title text-3xl md:text-4xl mb-2">Welcome Back</h2>
                            <p className="arch-subtitle uppercase tracking-widest text-[10px] opacity-60">Authorize system access</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm mb-8 text-[10px] font-bold tracking-widest flex items-center gap-3 uppercase"
                                >
                                    <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex px-8 md:px-10 pb-10 gap-6">
                        <div className="arch-card__line-nums" aria-hidden="true">
                            <span>01</span>
                            <span>02</span>
                            <span>03</span>
                            <span>04</span>
                            <span>05</span>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <label className="arch-eyebrow block">USER_EMAIL</label>
                                <div className="relative group">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-700 group-focus-within:text-[#f5c437] transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="arch-input w-full pl-12"
                                        placeholder="name@arch.net"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="arch-eyebrow block">USER_KEY</label>
                                <div className="relative group">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-700 group-focus-within:text-[#f5c437] transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="arch-input w-full pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={loading}
                                className="arch-btn w-full justify-center mt-4"
                            >
                                {loading ? (
                                    <Loader2Icon className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <span>AUTHORIZE</span>
                                        <ArrowUpRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    <div className="p-8 border-t border-white/[0.05] text-center bg-white/[0.01]">
                        <p className="arch-subtitle text-[10px]">
                            UNREGISTERED AGENT?{" "}
                            <Link to="/signup" className="text-[#f5c437] hover:underline transition-colors font-bold">
                                INITIALIZE IDENTITY
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

                .arch-root {
                    background: #080a0f;
                    font-family: 'Space Mono', monospace;
                    color: #e8e6e0;
                }

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
                .arch-corner::before { width: 100%; height: 1px; }
                .arch-corner::after  { height: 100%; width: 1px; }
                .arch-corner--tl { top: 24px; left: 24px; }
                .arch-corner--tl::before, .arch-corner--tl::after { top: 0; left: 0; }
                .arch-corner--tr { top: 24px; right: 24px; }
                .arch-corner--tr::before, .arch-corner--tr::after { top: 0; right: 0; }
                .arch-corner--bl { bottom: 24px; left: 24px; }
                .arch-corner--bl::before, .arch-corner--bl::after { bottom: 0; left: 0; }
                .arch-corner--br { bottom: 24px; right: 24px; }
                .arch-corner--br::before, .arch-corner--br::after { bottom: 0; right: 0; }

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

                .arch-card {
                    background: rgba(10,12,18,0.95);
                    border: 1px solid rgba(245,196,55,0.18);
                    border-radius: 4px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                    overflow: hidden;
                }

                .arch-card__topbar {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 20px;
                    border-bottom: 1px solid rgba(245,196,55,0.08);
                    background: rgba(245,196,55,0.02);
                }
                .arch-card__dots { display: flex; gap: 6px; }
                .arch-card__dots span {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: rgba(245,196,55,0.15);
                    border: 1px solid rgba(245,196,55,0.2);
                }
                .arch-card__label {
                    font-size: 9px;
                    letter-spacing: 0.2em;
                    color: rgba(245,196,55,0.5);
                }
                .arch-card__cursor {
                    font-size: 12px;
                    color: #f5c437;
                    margin-left: auto;
                    animation: arch-blink 1s step-end infinite;
                }

                .arch-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border: 1px solid rgba(245,196,55,0.3);
                    background: rgba(245,196,55,0.04);
                    color: #f5c437;
                    font-size: 8px;
                    letter-spacing: 0.2em;
                    border-radius: 2px;
                }
                .arch-badge__dot {
                    width: 4px; height: 4px;
                    border-radius: 50%;
                    background: #f5c437;
                    box-shadow: 0 0 8px #f5c437;
                    animation: arch-blink 1.8s ease-in-out infinite;
                }
                .arch-badge__sep { opacity: 0.4; }
                .arch-badge__sub { opacity: 0.6; }

                .arch-card__body { display: flex; }
                .arch-card__line-nums {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    color: rgba(245,196,55,0.2);
                    font-size: 10px;
                    line-height: 2.4; /* Manual adjustment for form spacing */
                    user-select: none;
                    text-align: right;
                    padding-top: 36px;
                }

                .arch-title {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #e8e6e0;
                }

                .arch-subtitle {
                    font-size: 11px;
                    color: rgba(232,230,224,0.45);
                    letter-spacing: 0.1em;
                }

                .arch-eyebrow {
                    font-size: 9px;
                    letter-spacing: 0.2em;
                    color: rgba(245,196,55,0.4);
                    text-transform: uppercase;
                }

                .arch-input {
                    background: rgba(245,196,55,0.02);
                    border: 1px solid rgba(245,196,55,0.1);
                    border-radius: 2px;
                    padding: 12px 16px;
                    color: #e8e6e0;
                    font-family: 'Space Mono', monospace;
                    font-size: 13px;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .arch-input:focus {
                    border-color: rgba(245,196,55,0.4);
                    background: rgba(245,196,55,0.05);
                    box-shadow: 0 0 20px rgba(245,196,55,0.05);
                }

                .arch-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px;
                    background: #f5c437;
                    color: #080a0f;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 0 30px rgba(245,196,55,0.25);
                }
                .arch-btn:hover {
                    background: #fcd94e;
                    box-shadow: 0 0 40px rgba(245,196,55,0.4);
                }

                @keyframes arch-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Login;

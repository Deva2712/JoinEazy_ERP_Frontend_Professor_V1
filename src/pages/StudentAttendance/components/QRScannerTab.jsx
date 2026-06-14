// src/pages/StudentAttendance/components/QRScannerTab.jsx
// Requires: npm install jsqr
import React, { useState, useEffect, useRef, useCallback } from "react";
import jsQR from "jsqr";
import { studentAttendanceAPI } from "../../../services/api";
import {
    CheckCircle2, XCircle, RefreshCw,
    Lock, Unlock, QrCode, AlertTriangle,
} from "lucide-react";

// ─── Math riddle generator ────────────────────────────────────────────────────
const RIDDLE_TYPES = [
    () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        return { question: `What is ${a} × ${b}?`, answer: a * b };
    },
    () => {
        const a = Math.floor(Math.random() * 50) + 20;
        const b = Math.floor(Math.random() * 20) + 5;
        return { question: `What is ${a} + ${b}?`, answer: a + b };
    },
    () => {
        const b = Math.floor(Math.random() * 20) + 5;
        const a = b + Math.floor(Math.random() * 40) + 10;
        return { question: `What is ${a} − ${b}?`, answer: a - b };
    },
    () => {
        const b = Math.floor(Math.random() * 8) + 2;
        const a = b * (Math.floor(Math.random() * 10) + 2);
        return { question: `What is ${a} ÷ ${b}?`, answer: a / b };
    },
    () => {
        const n = Math.floor(Math.random() * 8) + 2;
        return { question: `What is ${n}²?`, answer: n * n };
    },
];

const generateRiddle = () =>
    RIDDLE_TYPES[Math.floor(Math.random() * RIDDLE_TYPES.length)]();

// ─── QR Scanner hook ──────────────────────────────────────────────────────────
const QR_SCAN_INTERVAL_MS = 250;

function useQRScanner({ enabled, onResult }) {
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef  = useRef(null);
    const [camError, setCamError] = useState(null);
    const [scanning, setScanning] = useState(false);

    const stopStream = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = null;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setScanning(false);
    }, []);

    useEffect(() => {
        if (!enabled) {
            stopStream();
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setCamError(null);

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });

                if (cancelled) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                streamRef.current = stream;

                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    await new Promise((resolve) => {
                        video.onloadedmetadata = resolve;
                    });
                    await video.play();
                }

                setScanning(true);

                timerRef.current = setInterval(() => {
                    const v = videoRef.current;
                    const c = canvasRef.current;
                    if (!v || !c || v.readyState < 2 || v.videoWidth === 0) return;

                    c.width  = v.videoWidth;
                    c.height = v.videoHeight;
                    const ctx = c.getContext("2d");
                    ctx.drawImage(v, 0, 0, c.width, c.height);
                    const imgData = ctx.getImageData(0, 0, c.width, c.height);

                    const code = jsQR(imgData.data, imgData.width, imgData.height, {
                        inversionAttempts: "dontInvert",
                    });
                    if (code?.data) {
                        onResult(code.data);
                    }
                }, QR_SCAN_INTERVAL_MS);
            } catch (err) {
                if (!cancelled) {
                    setCamError(
                        err.name === "NotAllowedError"
                            ? "Camera permission denied. Please allow camera access and try again."
                            : "Could not access camera. Make sure no other app is using it."
                    );
                }
            }
        })();

        return () => {
            cancelled = true;
            stopStream();
        };
    }, [enabled, onResult, stopStream]);

    return { videoRef, canvasRef, camError, scanning };
}

// ─── Math Riddle Gate ─────────────────────────────────────────────────────────
function MathRiddleGate({ onUnlocked }) {
    const [riddle,   setRiddle]   = useState(generateRiddle);
    const [input,    setInput]    = useState("");
    const [status,   setStatus]   = useState("idle"); // idle | correct | wrong
    const [shakeKey, setShakeKey] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const refresh = () => {
        setRiddle(generateRiddle());
        setInput("");
        setStatus("idle");
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const check = () => {
        const parsed = parseInt(input.trim(), 10);
        if (isNaN(parsed)) return;
        if (parsed === riddle.answer) {
            setStatus("correct");
            setTimeout(onUnlocked, 700);
        } else {
            setStatus("wrong");
            setShakeKey(k => k + 1);
            setInput("");
            setTimeout(() => setStatus("idle"), 1200);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[420px] px-4 py-8">
            <div className={`p-5 rounded-full mb-6 transition-all duration-500 ${
                status === "correct"
                    ? "bg-green-100 dark:bg-green-500/20"
                    : "bg-indigo-100 dark:bg-indigo-500/15"
            }`}>
                {status === "correct"
                    ? <Unlock className="size-10 text-green-500" />
                    : <Lock   className="size-10 text-indigo-500" />
                }
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 text-center">
                Human Verification
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xs">
                Solve the math problem below to confirm your attendance.
            </p>

            <div className="w-full max-w-sm bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                        Math Riddle
                    </span>
                    <button
                        onClick={refresh}
                        className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        title="Get new riddle"
                    >
                        <RefreshCw className="size-4" />
                    </button>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white text-center py-2">
                    {riddle.question}
                </p>
            </div>

            <div
                key={shakeKey}
                className={`w-full max-w-sm ${status === "wrong" ? "animate-shake" : ""}`}
            >
                <div className={`flex gap-2 items-center rounded-2xl border-2 px-4 py-3 transition-all duration-200 bg-white dark:bg-[#1a1d27] ${
                    status === "wrong"
                        ? "border-red-400 dark:border-red-500"
                        : status === "correct"
                        ? "border-green-400 dark:border-green-500"
                        : "border-gray-200 dark:border-white/15 focus-within:border-indigo-500"
                }`}>
                    <input
                        ref={inputRef}
                        type="number"
                        inputMode="numeric"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && check()}
                        placeholder="Your answer…"
                        disabled={status === "correct"}
                        className="flex-1 bg-transparent text-gray-900 dark:text-white text-lg font-bold outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {status === "correct" && <CheckCircle2 className="size-5 text-green-500 shrink-0" />}
                    {status === "wrong"   && <XCircle      className="size-5 text-red-500 shrink-0" />}
                </div>
            </div>

            <button
                onClick={check}
                disabled={!input.trim() || status === "correct"}
                className="mt-4 w-full max-w-sm py-3.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
                Confirm Attendance
            </button>

            {status === "wrong" && (
                <p className="mt-3 text-sm text-red-500 font-semibold animate-fade-in">
                    Incorrect — try again!
                </p>
            )}

            <style>{`
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    15%     { transform: translateX(-6px); }
                    45%     { transform: translateX(6px); }
                    75%     { transform: translateX(-4px); }
                    90%     { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.45s ease; }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease; }
            `}</style>
        </div>
    );
}

// ─── Scanner View ─────────────────────────────────────────────────────────────
function ScannerView({ onReset, onAttendanceMarked }) {
    const [scanned,    setScanned]    = useState(null);
    const [showRiddle, setShowRiddle] = useState(false);
    const [markStatus, setMarkStatus] = useState(null); // "loading" | "success" | "error"

    // Step 1: QR detected → stop camera, show riddle
    const handleResult = useCallback((data) => {
        if (scanned) return;
        setScanned(data);
        setShowRiddle(true);
    }, [scanned]);

    // Step 2: Riddle solved → mark attendance
    const handleRiddleUnlocked = useCallback(async () => {
        setShowRiddle(false);
        setMarkStatus("loading");
        try {
            const res = await studentAttendanceAPI.markAttendanceQR(scanned);
            if (res.success) {
                setMarkStatus("success");
                if (onAttendanceMarked) setTimeout(onAttendanceMarked, 1500);
            } else {
                setMarkStatus("error");
            }
        } catch {
            setMarkStatus("error");
        }
    }, [scanned, onAttendanceMarked]);

    const { videoRef, canvasRef, camError, scanning } = useQRScanner({
        enabled: !scanned,  // no CDN gate — starts immediately
        onResult: handleResult,
    });

    const resetScan = () => {
        setScanned(null);
        setShowRiddle(false);
        setMarkStatus(null);
    };

    // ── Riddle gate (shown right after QR scan)
    if (showRiddle) return (
        <MathRiddleGate onUnlocked={handleRiddleUnlocked} />
    );

    // ── Result view (shown after riddle is solved)
    if (scanned) return (
        <div className="flex flex-col items-center justify-center min-h-[420px] px-4 py-8">
            <div className="p-5 rounded-full bg-green-100 dark:bg-green-500/20 mb-5">
                <CheckCircle2 className="size-10 text-green-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                QR Code Scanned!
            </h2>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Attendance data received
            </p>
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-white/10 rounded-2xl p-4 mb-6 break-all">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">{scanned}</p>
            </div>

            {markStatus === "loading" && (
                <p className="text-sm text-gray-500 animate-pulse">Marking attendance…</p>
            )}
            {markStatus === "success" && (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-4" /> Attendance marked successfully!
                </div>
            )}
            {markStatus === "error" && (
                <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
                    <AlertTriangle className="size-4" /> Failed to mark attendance. Try again.
                </div>
            )}

            <div className="flex gap-3 w-full max-w-sm mt-5">
                <button
                    onClick={resetScan}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                >
                    <QrCode className="size-4" /> Scan Another
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white transition-all"
                >
                    <RefreshCw className="size-4" />
                </button>
            </div>
        </div>
    );

    // ── Camera error
    if (camError) return (
        <div className="flex flex-col items-center justify-center min-h-[420px] px-4 py-8 text-center">
            <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-500/15 mb-5">
                <AlertTriangle className="size-9 text-yellow-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Camera Unavailable</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{camError}</p>
            <button
                onClick={resetScan}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white transition-all"
            >
                <RefreshCw className="size-4" /> Try Again
            </button>
        </div>
    );

    // ── Live camera / scanning view
    return (
        <div className="flex flex-col items-center px-4 py-6">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Point camera at QR code
            </p>

            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-black shadow-xl mb-5">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Corner brackets */}
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-5 left-5 w-10 h-10 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
                    <span className="absolute top-5 right-5 w-10 h-10 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
                    <span className="absolute bottom-5 left-5 w-10 h-10 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
                    <span className="absolute bottom-5 right-5 w-10 h-10 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />

                    {scanning && (
                        <div className="absolute left-5 right-5 h-0.5 bg-indigo-400/80 shadow-[0_0_8px_2px_rgba(129,140,248,0.6)] animate-scan-line" />
                    )}
                </div>
            </div>

            {/* Status pill */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                scanning
                    ? "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400"
                    : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
            }`}>
                <span className={`size-2 rounded-full ${scanning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                {scanning ? "Scanning…" : "Initialising camera…"}
            </div>

            <style>{`
                @keyframes scan-line {
                    0%   { top: 1.25rem; opacity: 1; }
                    48%  { opacity: 1; }
                    50%  { top: calc(100% - 1.25rem); opacity: 0.6; }
                    52%  { opacity: 1; }
                    100% { top: 1.25rem; opacity: 1; }
                }
                .animate-scan-line { animation: scan-line 2.4s ease-in-out infinite; }
            `}</style>
        </div>
    );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function QRScannerTab({ onAttendanceMarked }) {
    return <ScannerView onReset={() => {}} onAttendanceMarked={onAttendanceMarked} />;
}
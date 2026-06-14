// src/pages/ResetPassword/ResetPasswordUI.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Sparkles, Shield, Mail, Lock, Key, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import logoImage from "@/assets/images/Joineazy final-01.png";
import { useResetPassword } from "./useresetpassword";

// ── Shared primitives ─────────────────────────────────────────────────────────
const inputCls = "pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400";
const submitCls = "w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl";

const ErrorBox  = ({ msg }) => msg ? <div className="bg-red-50 border border-red-200 rounded-xl p-4"><p className="text-red-600 text-sm text-center">{msg}</p></div> : null;
const BackBtn   = ({ onClick, label }) => (
	<div className="text-center">
		<Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-800 p-0 h-auto text-sm flex items-center gap-1 mx-auto" onClick={onClick}>
			<ArrowLeft className="w-4 h-4" /> {label}
		</Button>
	</div>
);
const PwdToggle = ({ show, onToggle }) => (
	<Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100/50 rounded-lg" onClick={onToggle}>
		{show ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
	</Button>
);

export default function ResetPasswordUI(props) {
	const { logo_link, privacy_link, terms_link, guide_link, signin_link } = props;
	const navigate = useNavigate();
	const go = (url) => navigate(url);

	const {
		showVerification, showNewPassword, showPassword, setShowPassword,
		resetForm, verificationForm, newPasswordForm,
		isLoading, isVerifying, isSubmitting,
		resetError, verifyError, submitError,
		verificationCode, setVerificationCode,
		stepMeta,
		onResetSubmit, onVerifySubmit, onPasswordSubmit, onResendCode,
		handleBackToReset, setShowNewPassword, setSubmitError,
	} = useResetPassword({ ...props, signin_link });

	const Icon = stepMeta.icon;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
			{/* Background blobs */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
				<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
			</div>
			{[{ top: "20%", left: "10%", size: 32, dur: "8s",  delay: "0s",  shape: "rounded-full" },
			  { top: "30%", right: "15%", size: 24, dur: "10s", delay: "2s",  shape: "rounded-lg rotate-45" },
			  { bottom: "25%", left: "20%", size: 20, dur: "12s", delay: "4s", shape: "rounded-full" },
			].map((s, i) => <div key={i} className={`absolute border border-purple-300/30 ${s.shape} animate-float opacity-25`} style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom, width: `${s.size * 4}px`, height: `${s.size * 4}px`, animationDuration: s.dur, animationDelay: s.delay }} />)}

			{/* Header */}
			<header className="relative z-10 w-full p-2">
				<div className="flex justify-between items-center">
					<div className="flex items-center cursor-pointer group" onClick={() => go(logo_link)}>
						<img src={logoImage} alt="Joineazy Logo" className="h-32 w-auto transition-transform duration-300 group-hover:scale-110" />
					</div>
					<nav className="flex items-center gap-6">
						{[["Privacy", privacy_link], ["Terms", terms_link], ["Guide", guide_link]].map(([label, link]) => (
							<Button key={label} variant="ghost" className="text-slate-700 hover:text-slate-900 font-medium" onClick={() => go(link)}>{label}</Button>
						))}
					</nav>
				</div>
			</header>

			{/* Main */}
			<div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium mb-4">
							<Icon className="w-4 h-4" /> {stepMeta.title}
						</div>
						<h1 className="text-3xl font-bold text-slate-900 mb-2">{stepMeta.title}</h1>
						<p className="text-slate-600">{stepMeta.desc}</p>
					</div>

					<Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
						<CardContent className="p-8">

							{/* ── Step 3: New Password ── */}
							{showNewPassword ? (
								<Form {...newPasswordForm}>
									<form onSubmit={newPasswordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
										{["password", "confirmPassword"].map((name) => (
											<FormField key={name} control={newPasswordForm.control} name={name} render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-700 font-semibold text-sm">{name === "password" ? "New Password" : "Confirm Password"}</FormLabel>
													<FormControl>
														<div className="relative group">
															<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
															<Input type={showPassword ? "text" : "password"} placeholder={name === "password" ? "Enter your new password" : "Confirm your new password"} className={inputCls} autoComplete="new-password" {...field} />
															<PwdToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
														</div>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)} />
										))}
										<ErrorBox msg={submitError} />
										<Button type="submit" className={submitCls} disabled={isSubmitting}>
											{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating password...</> : <><Key className="mr-2 h-4 w-4" />Update Password</>}
										</Button>
										<div className="text-center text-sm text-slate-600">
											Remember your password?{" "}
											<Button type="button" variant="link" className="text-blue-600 font-semibold p-0 h-auto text-sm" onClick={() => go(signin_link)}>Sign in instead</Button>
										</div>
										<BackBtn onClick={() => { setShowNewPassword(false); setSubmitError(null); }} label="Back to Verification" />
									</form>
								</Form>

							/* ── Step 2: Verify OTP ── */
							) : showVerification ? (
								<form onSubmit={(e) => { e.preventDefault(); if (verificationCode.length === 4) onVerifySubmit({ verificationCode }); }} className="space-y-6">
									<div>
										<label className="text-slate-700 font-semibold text-sm block mb-2">Verification Code</label>
										<div className="relative group">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
											<Input type="text" placeholder="Enter 4-digit code" value={verificationCode}
												className={`${inputCls} text-center text-lg font-mono tracking-widest`}
												onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
												autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]*" maxLength={4} autoFocus />
										</div>
									</div>
									<ErrorBox msg={verifyError} />
									<Button type="submit" className={submitCls} disabled={isVerifying || verificationCode.length !== 4}>
										{isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : <><Sparkles className="mr-2 h-4 w-4" />Verify Email</>}
									</Button>
									<div className="text-center text-sm text-slate-600">
										Didn't receive a code?{" "}
										<Button type="button" variant="link" className="text-blue-600 font-semibold p-0 h-auto text-sm" onClick={onResendCode}>Resend code</Button>
									</div>
									<BackBtn onClick={handleBackToReset} label="Back to Reset Password" />
								</form>

							/* ── Step 1: Email ── */
							) : (
								<Form {...resetForm}>
									<form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
										<FormField control={resetForm.control} name="email" render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-700 font-semibold text-sm">Email Address</FormLabel>
												<FormControl>
													<div className="relative group">
														<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
														<Input type="email" placeholder="Enter your email" className={inputCls} autoFocus {...field} />
													</div>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)} />
										<ErrorBox msg={resetError} />
										<Button type="submit" className={submitCls} disabled={isLoading}>
											{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending reset link...</> : <><Lock className="mr-2 h-4 w-4" />Send Reset Link</>}
										</Button>
										<div className="text-center text-sm text-slate-600">
											Remember your password?{" "}
											<Button type="button" variant="link" className="text-blue-600 font-semibold p-0 h-auto text-sm" onClick={() => go(signin_link)}>Sign in instead</Button>
										</div>
										<div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
											<div className="flex items-center gap-2 text-slate-600 text-xs">
												<Shield className="w-4 h-4" />
												<span>By resetting your password, you agree to our Terms of Service and Privacy Policy</span>
											</div>
										</div>
									</form>
								</Form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			<style>{`
				@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
				.animate-float { animation: float 6s ease-in-out infinite; }
			`}</style>
		</div>
	);
}
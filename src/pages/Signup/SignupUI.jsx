// src/pages/Signup/SignupUI.jsx

import { UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useSignupUI from "./Usesignupui";

import Background from "./components/Background";
import PageHeader from "./components/PageHeader";
import SignupForm from "./components/SignupForm";
import VerificationForm from "./components/VerificationForm";

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function SignupUI({ logo_link, privacy_link, terms_link, guide_link, signin_link, back_link, handleSignup, handleResend, handleConfirm }) {
	const s = useSignupUI({ handleSignup, handleResend, handleConfirm, signin_link, logo_link });

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
			<Background />

			<PageHeader
				onLogoClick={() => s.navigate(logo_link)}
				onLinkClick={(url) => s.navigate(url)}
				privacy_link={privacy_link} terms_link={terms_link} guide_link={guide_link}
			/>

			<div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium mb-4">
							<UserPlus className="w-4 h-4" />
							{s.showVerification ? "Verify Email" : "Join JoinEazy"}
						</div>
						<h1 className="text-3xl font-bold text-slate-900 mb-2">
							{s.showVerification ? "Confirm Your Email" : "Create Your Account"}
						</h1>
						<p className="text-slate-600">
							{s.showVerification ? "Enter the verification code sent to your email" : "Start your journey with seamless team collaboration"}
						</p>
					</div>

					<Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
						<CardContent className="p-8">
							{!s.showVerification ? (
								<SignupForm
									signupForm={s.signupForm} onSubmit={s.onSubmit}
									showPassword={s.showPassword} setShowPassword={s.setShowPassword}
									signupError={s.signupError} isLoading={s.isLoading}
									onLinkClick={(url) => s.navigate(url)}
									signin_link={signin_link} terms_link={terms_link} privacy_link={privacy_link}
								/>
							) : (
								<VerificationForm
									verificationForm={s.verificationForm} onVerify={s.onVerify}
									confirmError={s.confirmError} isConfirming={s.isConfirming}
									onResendCode={s.onResendCode} onBackClick={() => s.navigate(back_link)}
								/>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			<style jsx>{`
				@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
				.animate-float { animation: float 6s ease-in-out infinite; }
			`}</style>
		</div>
	);
}
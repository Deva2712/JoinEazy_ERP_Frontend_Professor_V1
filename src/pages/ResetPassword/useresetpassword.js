// src/pages/ResetPassword/useResetPassword.js
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, Key } from "lucide-react";

// ── Schemas ───────────────────────────────────────────────────────────────────
const resetSchema = z.object({
	email: z.string().email("Email is invalid"),
});

const verificationSchema = z.object({
	verificationCode: z.string().min(1, "Verification code is required"),
});

const newPasswordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
	message: "Passwords don't match", path: ["confirmPassword"],
});

export function useResetPassword({ handleReset, handleResend, handleVerify, handleSubmit, signin_link }) {
	const navigate  = useNavigate();
	const { toast } = useToast();

	// ── Step state ────────────────────────────────────────────────────────────
	const [showVerification, setShowVerification] = useState(false);
	const [showNewPassword,  setShowNewPassword]  = useState(false);
	const [showPassword,     setShowPassword]     = useState(false);

	// ── Loading / error state ─────────────────────────────────────────────────
	const [isLoading,    setIsLoading]    = useState(false);
	const [isVerifying,  setIsVerifying]  = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resetError,   setResetError]   = useState(null);
	const [verifyError,  setVerifyError]  = useState(null);
	const [submitError,  setSubmitError]  = useState(null);

	// ── Stored values across steps ────────────────────────────────────────────
	const [storedEmail,        setStoredEmail]        = useState("");
	const [storedOtp,          setStoredOtp]          = useState("");
	const [verificationCode,   setVerificationCode]   = useState("");

	// ── Forms ─────────────────────────────────────────────────────────────────
	const resetForm        = useForm({ resolver: zodResolver(resetSchema),        defaultValues: { email: "" },                              mode: "onBlur" });
	const verificationForm = useForm({ resolver: zodResolver(verificationSchema), defaultValues: { verificationCode: "" },                   mode: "onChange" });
	const newPasswordForm  = useForm({ resolver: zodResolver(newPasswordSchema),  defaultValues: { password: "", confirmPassword: "" } });

	// Reset sub-forms when switching steps
	useEffect(() => {
		if (showVerification && !showNewPassword) {
			setVerificationCode("");
			verificationForm.reset({ verificationCode: "" });
		} else if (showNewPassword) {
			newPasswordForm.reset({ password: "", confirmPassword: "" });
		}
	}, [showVerification, showNewPassword]);

	// ── Step metadata ─────────────────────────────────────────────────────────
	const stepMeta = showNewPassword
		? { title: "Set New Password",    desc: "Enter your new password that will be used for future logins", icon: Key  }
		: showVerification
		? { title: "Verify Your Email",   desc: "Enter the verification code sent to your email",              icon: Mail }
		: { title: "Reset Your Password", desc: "Enter your email to receive a password reset link",           icon: Lock };

	// ── Submit handlers ───────────────────────────────────────────────────────
	const onResetSubmit = async (data) => {
		setIsLoading(true); setResetError(null);
		try {
			const [success, errorMessage] = await handleReset(data);
			if (success) {
				setShowVerification(true); setStoredEmail(data.email);
				setVerificationCode(""); verificationForm.reset({ verificationCode: "" }); setVerifyError(null);
			} else { setResetError(errorMessage); }
		} catch { setResetError("An unexpected error occurred. Please try again."); }
		finally { setIsLoading(false); }
	};

	const onVerifySubmit = async (data) => {
		setIsVerifying(true); setVerifyError(null);
		try {
			const code = verificationCode || data.verificationCode;
			const [success, errorMessage] = await handleVerify(code, storedEmail);
			if (success) {
				setShowNewPassword(true); setStoredOtp(code);
				newPasswordForm.reset({ password: "", confirmPassword: "" }); setSubmitError(null);
			} else { setVerifyError(errorMessage); }
		} catch { setVerifyError("An unexpected error occurred. Please try again."); }
		finally { setIsVerifying(false); }
	};

	const onPasswordSubmit = async (data) => {
		setIsSubmitting(true); setSubmitError(null);
		try {
			const errorMessage = await handleSubmit(data, storedEmail, storedOtp);
			if (errorMessage) { setSubmitError(errorMessage); }
			else { toast({ title: "Success", description: "Password reset successfully!" }); navigate(signin_link); }
		} catch { setSubmitError("An unexpected error occurred. Please try again."); }
		finally { setIsSubmitting(false); }
	};

	const onResendCode = async () => {
		try {
			await handleResend(storedEmail);
			setVerificationCode(""); verificationForm.reset({ verificationCode: "" }); setVerifyError(null);
			toast({ title: "Code Resent", description: "Verification code has been resent to your email." });
		} catch {
			toast({ title: "Error", description: "Failed to resend code. Please try again.", variant: "destructive" });
		}
	};

	const handleBackToReset = () => {
		setShowVerification(false); setShowNewPassword(false);
		setStoredEmail(""); setStoredOtp(""); setVerificationCode("");
		setResetError(null); setVerifyError(null); setSubmitError(null);
		resetForm.reset({ email: "" });
		verificationForm.reset({ verificationCode: "" });
		newPasswordForm.reset({ password: "", confirmPassword: "" });
	};

	return {
		// step flags
		showVerification, showNewPassword, showPassword, setShowPassword,
		// forms
		resetForm, verificationForm, newPasswordForm,
		// loading
		isLoading, isVerifying, isSubmitting,
		// errors
		resetError, verifyError, submitError,
		// verification code
		verificationCode, setVerificationCode,
		// metadata
		stepMeta,
		// handlers
		onResetSubmit, onVerifySubmit, onPasswordSubmit, onResendCode,
		handleBackToReset,
		setShowNewPassword, setSubmitError,
	};
}
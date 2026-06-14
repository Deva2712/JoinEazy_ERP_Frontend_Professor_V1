// src/pages/Signup/useSignupUI.js

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signupSchema = z.object({
	email: z
		.string()
		.email("Email is invalid")
		.refine((val) => val.toLowerCase().endsWith("@mahindrauniversity.edu.in"), {
			message: "Use your @mahindrauniversity.edu.in email",
		}),
	password: z.string().min(7, "Password must be atleast 7 characters"),
});

const verificationSchema = z.object({
	verificationCode: z.string().length(4, "Enter the 4-digit code sent to your email"),
});

const useSignupUI = ({ handleSignup, handleResend, handleConfirm, signin_link, logo_link }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [signupError, setSignupError] = useState(null);
	const [showVerification, setShowVerification] = useState(false);
	const [confirmError, setConfirmError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);

	const navigate = useNavigate();
	const { toast } = useToast();

	const signupForm = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: { email: "", password: "" },
		mode: "onBlur",
	});

	const verificationForm = useForm({
		resolver: zodResolver(verificationSchema),
		defaultValues: { verificationCode: "" },
	});

	const onSubmit = async (data) => {
		setIsLoading(true);
		setSignupError(null);
		try {
			const [success, errorMessage] = await handleSignup(data);
			if (success) setShowVerification(true);
			else setSignupError(errorMessage);
		} catch {
			setSignupError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const onVerify = async (data) => {
		setIsConfirming(true);
		setConfirmError(null);
		try {
			const email = signupForm.getValues("email");
			const password = signupForm.getValues("password");
			const errorMessage = await handleConfirm(data.verificationCode, email, password);
			if (errorMessage) {
				setConfirmError(errorMessage);
			} else {
				toast({ title: "Success", description: "Email verified successfully!" });
				navigate(signin_link);
			}
		} catch {
			setConfirmError("An unexpected error occurred. Please try again.");
		} finally {
			setIsConfirming(false);
		}
	};

	const onResendCode = async () => {
		try {
			await handleResend();
			toast({ title: "Code Resent", description: "Verification code has been resent to your email." });
		} catch {
			toast({ title: "Error", description: "Failed to resend code. Please try again.", variant: "destructive" });
		}
	};

	return {
		showPassword, setShowPassword,
		signupError, confirmError,
		showVerification,
		isLoading, isConfirming,
		signupForm, verificationForm,
		onSubmit, onVerify, onResendCode,
		navigate,
	};
};

export default useSignupUI;
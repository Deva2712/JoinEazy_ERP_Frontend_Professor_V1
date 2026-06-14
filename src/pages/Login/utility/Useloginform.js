import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email is invalid")
    .refine((val) => val.toLowerCase().endsWith("@mahindrauniversity.edu.in"), {
      message: "Use your @mahindrauniversity.edu.in email",
    }),
  password: z.string().min(1, "Password cannot be empty"),
  rememberMe: z.boolean().optional(),
});

export function useLoginForm({ handleLogin, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const message = location.state?.message;

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const errorMessage = await handleLogin(data);
      if (errorMessage) {
        setLoginError(errorMessage);
      } else {
        toast({ title: "Login successful", description: "Welcome back!" });
        if (onLoginSuccess) await onLoginSuccess({ email: data.email });
      }
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginForm,
    showPassword,
    setShowPassword,
    loginError,
    isLoading,
    message,
    onSubmit,
    navigate,
  };
}
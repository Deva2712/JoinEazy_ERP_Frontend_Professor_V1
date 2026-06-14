// src/pages/Login/LoginController.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, checkLoginStatus } from "../../services/auth.js";
import { useAuth } from "../../context/AuthContext";
import useInvitationHandler from "./utility/Useinvitationhandler.js";
import LoginUI from "./LoginUI";

const ALLOWED_DOMAIN = "@mahindrauniversity.edu.in";

const config = {
  privacy_link:          "/privacy",
  terms_link:            "/terms",
  guide_link:            "/guide",
  signup_link:           "/signup",
  forgot_password_link:  "/reset-password",
  logo_link:             "/",
};

export default function LoginController() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login: updateAuthState } = useAuth();

  const from            = location.state?.from || "/dashboard";
  const invitationToken = location.state?.invitationToken;

  const { processInvitation } = useInvitationHandler({ invitationToken, navigate });

  useEffect(() => { document.title = "Sign in"; }, []);

  const handleLogin = async ({ email, password }) => {
    if (!email || !password)          return "Please fill in all fields";
    if (!email.includes("@"))         return "Please enter a valid email address";
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN))
      return `Please use your institutional email ending with ${ALLOWED_DOMAIN}`;

    try {
      const result = await loginUser(email, password);
      return result.success ? null : result.error || "Login failed. Please check your credentials and try again";
    } catch {
      return "Network error. Please try again.";
    }
  };

  const handleLoginSuccess = async (userData) => {
    // Wait for cookies to be set, then verify auth
    await new Promise((resolve) => setTimeout(resolve, 200));
    let authCheck = await checkLoginStatus();

    if (!authCheck.isLoggedIn) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      authCheck = await checkLoginStatus();
      if (!authCheck.isLoggedIn) {
        alert("Login completed but authentication verification failed. Please try logging in again.");
        return;
      }
    }

    const handled = await processInvitation(userData);
    if (handled) return;

    await updateAuthState();
    const role = localStorage.getItem("userRole");


    if (role === "hod") {
      navigate("/dashboard");
    } else if (role === "hr") {
      navigate("/hr-leave-dashboard");
    } else {
      navigate(from);
    }
  };

  return (
    <LoginUI
      {...config}
      handleLogin={handleLogin}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
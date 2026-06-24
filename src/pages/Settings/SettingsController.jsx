import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { userAPI, studentProfileAPI } from "../../services/api";
import { userService  } from "@/api/services/user.service";
import { studentProfileService } from "@/api/services/studentProfile.service";
import { changePassword, logoutUser } from "../../services/auth";
import SettingsUI from "./SettingsUI";
import StudentProfileUI from "./StudentProfileUI";

const SettingsController = () => {
    const { view } = useParams();
    const navigate  = useNavigate();

    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState(null);
    const [profileImageUrl,  setProfileImageUrl]  = useState("https://via.placeholder.com/150");

    const isStudent = localStorage.getItem("userRole") === "student";

    // ── Professor profile data ────────────────────────────────────────────
    const [profileData, setProfileData] = useState({
        fullName: "", dateOfBirth: "", gender: "", employeeId: "",
        department: "", designation: "", officeLocation: "",
        permanentAddress: "", currentAddress: "", city: "", state: "",
        pinCode: "", country: "", mobileNumber: "", alternateNumber: "",
        officialEmail: "", personalEmail: "", linkedinProfile: "",
        panNumber: "", aadhaarNumber: "", documents: [],
    });

    // ── Student profile data (core fields) ───────────────────────────────
    const [studentData, setStudentData] = useState({
        fullName: "", dob: "", gender: "", aadhaarNumber: "",
        nationality: "Indian", religion: "", casteCategory: "",
        motherTongue: "", physicallyHandicapped: "No",
        mobileNumber: "", alternateMobile: "", officialEmail: "",
        personalEmail: "",
        permanentAddress: { line1: "", line2: "", city: "", state: "", pin: "", country: "India" },
        currentAddress:   { line1: "", line2: "", city: "", state: "", pin: "", country: "India" },
        sameAddress: false,
        father:   { name: "", occupation: "", income: "", mobile: "", email: "" },
        mother:   { name: "", occupation: "", income: "", mobile: "", email: "" },
        guardian: { name: "", relation: "", occupation: "", income: "", mobile: "", email: "" },
        tenth:   { school: "", board: "", year: "", percentage: "", subjects: "" },
        twelfth: { school: "", board: "", year: "", percentage: "", stream: "" },
        diploma: { college: "", board: "", year: "", percentage: "", branch: "" },
        ug:      { college: "", university: "", year: "", cgpa: "", branch: "" },
        pg:      { college: "", university: "", year: "", cgpa: "", branch: "" },
        careerObjective: "",
        hasGap: "No", gapYear: "", gapReason: "",
        bloodGroup: "", medicalConditions: "", emergencyContact: "",
        emergencyName: "", emergencyRelation: "",
        accountNumber: "", ifscCode: "", bankName: "", branchName: "",
        scholarshipLinked: "No",
        passportNumber: "", passportExpiry: "", visaType: "",
        visaExpiry: "", nationality2: "",
    });

    // ── Student portfolio data (entrance, docs, projects) ────────────────
    const [portfolioData, setPortfolioData] = useState({
        entranceExams:  [],
        documents:      [],
        portfolioLinks: [],
        skills:         [],
        certifications: [],
        achievements:   [],
    });

    const [additionalLinks] = useState([
        { id: "privacy-policy", label: "Privacy Policy",            path: "/privacy"  },
        { id: "terms-conditions", label: "Terms and Conditions",    path: "/terms"    },
        { id: "about-us",       label: "About Us",                  path: "/about"    },
        { id: "feedback",       label: "Feedback / Feature Request", path: "/feedback" },
    ]);

    const currentView   = view || "list";
    const setCurrentView = (newView) => {
        if (newView === "list") navigate("/settings");
        else navigate(`/settings/${newView}`);
    };

    useEffect(() => {
        fetchUserData();
        document.title = isStudent ? "My Profile" : "Settings";
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isStudent) {
                // Single round-trip for all student profile data
                const res = await studentProfileService.getProfile();
                if (!res.success) throw new Error(res.error || "Failed to load profile");

                const { studentData: sd = {}, portfolioData: pd = {} } = res.data;

                setStudentData(prev => ({ ...prev, ...sd }));
                setPortfolioData(prev => ({ ...prev, ...pd }));

                if (sd.profile_pic) {
                    setProfileImageUrl(
                        sd.profile_pic.startsWith("http")
                            ? sd.profile_pic
                            : `http://192.168.31.50:8000/uploads/${sd.profile_pic}`,
                    );
                }
            } else {
                // Professor: use existing userService
                const res = await userService.getDashboardOverview();
                if (!res.success) throw new Error(res.error || "Failed to load profile");

                const userData = res.data.user || res.data;
                // Convert null values to empty strings to prevent React controlled/uncontrolled input warning
                const sanitized = Object.fromEntries(
                    Object.entries(userData).map(([k, v]) => [k, v === null ? "" : v])
                );
                setProfileData(prev => ({ ...prev, ...sanitized }));

                if (userData.profile_pic) {
                    setProfileImageUrl(
                        userData.profile_pic.startsWith("http")
                            ? userData.profile_pic
                            : `http://192.168.31.50:8000/uploads/${userData.profile_pic}`,
                    );
                }
            }
        } catch (err) {
            setError("Failed to load profile. Please try again.");
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutClick = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
        }
    };

    const handleImageUpload = async (file) => {
        if (!file?.type.startsWith("image/")) {
            return { success: false, message: "Invalid image file" };
        }
        setProfileImageUrl(URL.createObjectURL(file));
        if (isStudent) {
            setStudentData(prev => ({ ...prev, profilePic: file }));
        } else {
            setProfileData(prev => ({ ...prev, profilePic: file }));
        }
        // Persist immediately
        return handleProfileSave();
    };

    // Saves core profile fields (personal → bank, passport, etc.)
    const handleProfileSave = async () => {
        setLoading(true);
        try {
            const res = isStudent
                ? await studentProfileService.updateProfile(studentData)
                : await userService.updateUserSettings(profileData);

            return res.success
                ? "Profile updated successfully"
                : res.error || "Failed to update profile";
        } catch {
            return "Failed to update profile.";
        } finally {
            setLoading(false);
        }
    };

    // Saves portfolio-only fields (entrance exams, docs, project links)
    const handlePortfolioSave = async () => {
        setLoading(true);
        try {
            const res = await studentProfileService.updatePortfolio(portfolioData);
            return res.success
                ? "Portfolio updated successfully"
                : res.error || "Failed to update portfolio";
        } catch {
            return "Failed to update portfolio.";
        } finally {
            setLoading(false);
        }
    };

    // Uploads a document file (marksheet, certificate, etc.)
    const handleDocumentUpload = async (file, docType) => {
        try {
            const res = await studentProfileService.uploadDocument(file, docType);
            if (res.success) {
                // Optimistically add the new doc to local state
                setPortfolioData(prev => ({
                    ...prev,
                    documents: [res.data, ...prev.documents],
                }));
            }
            return res.success
                ? "Document uploaded successfully"
                : res.error || "Upload failed";
        } catch {
            return "Failed to upload document.";
        }
    };

    const handlePasswordSave = async (current, newPass, confirm) => {
        if (newPass !== confirm)    return "Passwords do not match";
        if (newPass.length < 7)     return "Password must be at least 7 characters long";
        try {
            const res = await changePassword(current, newPass);
            return res.success ? "Password updated successfully!" : res.error;
        } catch {
            return "Failed to update password.";
        }
    };

    const handleBugReportSubmit = async (bugReport) => {
        const formData = new FormData();
        formData.append("description", bugReport.description);
        bugReport.screenshots?.forEach((file, i) =>
            formData.append(`screenshot_${i}`, file),
        );
        try {
            const res = await userService.submitBugReport(formData);
            return res.success
                ? { success: true }
                : { success: false, message: "Submission failed" };
        } catch {
            return { success: false, message: "Error submitting report" };
        }
    };

    // ── Student: render StudentProfileUI ─────────────────────────────────
    if (isStudent) {
        return (
            <StudentProfileUI
                currentView={currentView}
                setCurrentView={setCurrentView}
                studentData={studentData}
                setStudentData={setStudentData}
                portfolioData={portfolioData}
                setPortfolioData={setPortfolioData}
                profileImageUrl={profileImageUrl}
                loading={loading}
                error={error}
                additionalLinks={additionalLinks}
                onProfileSave={handleProfileSave}
                onPortfolioSave={handlePortfolioSave}
                onDocumentUpload={handleDocumentUpload}
                onImageUpload={handleImageUpload}
                onLogout={handleLogoutClick}
                onPasswordSave={handlePasswordSave}
                onBugReportSubmit={handleBugReportSubmit}
                onRefresh={fetchUserData}
            />
        );
    }

    // ── Professor: render SettingsUI ──────────────────────────────────────
    return (
        <SettingsUI
            currentView={currentView}
            profileData={profileData}
            setProfileData={setProfileData}
            handleLogoutClick={handleLogoutClick}
            handleProfileSave={handleProfileSave}
            handlePasswordSave={handlePasswordSave}
            handleBugReportSubmit={handleBugReportSubmit}
            handleImageUpload={handleImageUpload}
            additionalLinks={additionalLinks}
            loading={loading}
            error={error}
            onRefresh={fetchUserData}
        />
    );
};

export default SettingsController;
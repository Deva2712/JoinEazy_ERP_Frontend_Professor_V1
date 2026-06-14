import React from "react";
import HeaderController    from "@/components/layout/Header/HeaderController";
import BottomNavController from "@/components/layout/BottomNav/BottomNavController";
import FooterController    from "@/components/layout/Footer/FooterController";
import ListView      from "./views/ListView";
import PersonalView  from "./views/PersonalView";
import ContactView   from "./views/ContactView";
import FamilyView    from "./views/FamilyView";
import AcademicView  from "./views/AcademicView";
import EntranceView  from "./views/EntranceView";
import DocumentsView from "./views/DocumentsView";
import PassportView  from "./views/PassportView";
import PortfolioView from "./views/PortfolioView";
import GapView       from "./views/GapView";
import MedicalView   from "./views/MedicalView";
import BankView      from "./views/BankView";
import PrintView     from "./views/PrintView";
import SecurityView  from "./views/SecurityView";
import BugReportView from "./views/BugReportView";

const StudentProfileUI = ({
    currentView,
    studentData, setStudentData,
    portfolioData, setPortfolioData,
    profileImageUrl,
    loading, error,
    additionalLinks,
    onProfileSave, onPortfolioSave, onDocumentUpload,
    onImageUpload, onLogout, onPasswordSave, onBugReportSubmit,
    onRefresh,
}) => {
    const commonProfileProps = { studentData, setStudentData, onSave: onProfileSave, loading };

    const renderView = () => {
        switch (currentView) {
            case "personal":   return <PersonalView  {...commonProfileProps} />;
            case "contact":    return <ContactView   {...commonProfileProps} />;
            case "family":     return <FamilyView    {...commonProfileProps} />;
            case "academic":   return <AcademicView  {...commonProfileProps} />;
            case "entrance":   return <EntranceView  portfolioData={portfolioData} setPortfolioData={setPortfolioData} onSave={onPortfolioSave} loading={loading} />;
            case "documents":  return <DocumentsView portfolioData={portfolioData} setPortfolioData={setPortfolioData} onUpload={onDocumentUpload} loading={loading} />;
            case "passport":   return <PassportView  {...commonProfileProps} />;
            case "portfolio":  return <PortfolioView portfolioData={portfolioData} setPortfolioData={setPortfolioData} onSave={onPortfolioSave} loading={loading} />;
            case "gap":        return <GapView       {...commonProfileProps} />;
            case "medical":    return <MedicalView   {...commonProfileProps} />;
            case "bank":       return <BankView      {...commonProfileProps} />;
            case "print":      return <PrintView />;
            case "password":   return <SecurityView  onSavePassword={onPasswordSave} loading={loading} />;
            case "bug-report": return <BugReportView onSaveBugReport={onBugReportSubmit} loading={loading} />;
            default:           return <ListView studentData={studentData} profileImageUrl={profileImageUrl} onImageUpload={onImageUpload} onLogout={onLogout} additionalLinks={additionalLinks} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pb-24">
            <HeaderController />
            <main className="max-w-4xl mx-auto px-4 py-4 md:py-8">
                {renderView()}
            </main>
            <BottomNavController />
            <FooterController />
        </div>
    );
};

export default StudentProfileUI;
// src/pages/StudentCourses/views/RegistrationView.jsx
import React from "react";
import RegistrationOpen   from "./registration/RegistrationOpen";
import RegistrationLocked from "./registration/RegistrationLocked";

export default function RegistrationView({
    userProfile,
    registrationConfig,
    registrationCourses,
    myRegistrations,
    onSubmitRegistration,
    onCancelRegistration,
    onSwapElective,
}) {
    if (registrationConfig.isOpen) {
        return (
            <RegistrationOpen
                userProfile={userProfile}
                registrationCourses={registrationCourses}
                myRegistrations={myRegistrations}
                registrationConfig={registrationConfig}
                onSubmitRegistration={onSubmitRegistration}
                onCancelRegistration={onCancelRegistration}
                onSwapElective={onSwapElective}
            />
        );
    }

    return (
        <RegistrationLocked
            nextWindowDate={registrationConfig.nextWindowDate}
            windowEnd={registrationConfig.windowEnd}
            myRegistrations={myRegistrations}
            onCancelRegistration={onCancelRegistration}
        />
    );
}
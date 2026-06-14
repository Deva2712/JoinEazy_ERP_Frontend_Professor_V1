import { apiCall } from "../client";

export const hostelService = {
    //student hostel APIs
    getDashboard: () => apiCall("/hostel/dashboard"),
 

    //leave request APIs
    submitLeaveRequest: (data) =>
        apiCall("/hostel/leave", {
            method: "POST",
            body: JSON.stringify(data),
        }),


        //outing request APIs
    submitOutingRequest: (data) =>
        apiCall("/hostel/outing", {
            method: "POST",
            body: JSON.stringify(data),
        }),

        //maintenance request APIs
    submitMaintenanceRequest: (data) =>
        apiCall("/hostel/maintenance", {
            method: "POST",
            body: JSON.stringify(data),
        }),

        //complaint APIs
    submitComplaint: (data) =>
        apiCall("/hostel/complaints", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
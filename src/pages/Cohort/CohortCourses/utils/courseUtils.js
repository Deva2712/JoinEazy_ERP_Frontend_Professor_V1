
  export const getDeadlineInfo = (course) => {
    if (!course) return { text: "", color: "#6b7280" };

    if (course.submitted) {
      return {
        text: "Submitted",
        color: "#10b981",
      };
    }

    if (course.status === "missed") {
      return {
        text: "Missed",
        color: "#ef4444",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(course.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Missed",
        color: "#ef4444",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due Today",
        color: "#10b981",
      };
    } else if (diffDays === 1) {
      return {
        text: "Due Tomorrow",
        color: "#f59e0b",
      };
    } else {
      return {
        text: deadlineDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        color: "#6b7280",
      };
    }
  };

  export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

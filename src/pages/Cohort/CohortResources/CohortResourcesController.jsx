import React, { useState, useEffect } from "react";
import ResourcesUIProfessor from "./ResourcesUIProfessor";
import ResourcesUIStudent from "./ResourcesUIStudent";
// import { courseAPI } from "../../../services/api";
import { courseService } from "../../../api/services/course.service";


const CohortResourcesController = ({ cohortId, cohortData }) => {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if user is professor
  const isProfessor = 
    cohortData?.role === 'creator' || 
    cohortData?.role === 'professor' || 
    cohortData?.role === 'admin' ||
    cohortData?.user_type === 1 || 
    cohortData?.is_admin === true;

  console.log('cohortData:', cohortData);
  console.log('isProfessor:', isProfessor);

  useEffect(() => {
    fetchResources();
  }, [cohortId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await courseService.getResources(cohortId);
      
      if (response.success) {
        setResources(response.data);
      } else {
        setError(response.error || "Failed to load resources");
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWeek = async (weekData) => {
    try {
      const response = await courseService.createWeek(cohortId, weekData);
      if (response.success) {
        await fetchResources(); // Refresh data
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error creating week:", err);
      return { success: false, error: "Failed to create week" };
    }
  };

  const handleUpdateWeek = async (weekId, weekData) => {
    try {
      const response = await courseService.updateWeek(cohortId, weekId, weekData);
      if (response.success) {
        await fetchResources();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error updating week:", err);
      return { success: false, error: "Failed to update week" };
    }
  };

  const handleDeleteWeek = async (weekId) => {
    try {
      const response = await courseService.deleteWeek(cohortId, weekId);
      if (response.success) {
        await fetchResources();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error deleting week:", err);
      return { success: false, error: "Failed to delete week" };
    }
  };

  const handleCreateResource = async (weekId, resourceData) => {
    try {
      const response = await courseService.createResource(cohortId, weekId, resourceData);
      if (response.success) {
        await fetchResources();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error creating resource:", err);
      return { success: false, error: "Failed to create resource" };
    }
  };

  const handleUpdateResource = async (resourceId, resourceData) => {
    try {
      const response = await courseService.updateResource(cohortId, resourceId, resourceData);
      if (response.success) {
        await fetchResources();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error updating resource:", err);
      return { success: false, error: "Failed to update resource" };
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const response = await courseService.deleteResource(cohortId, resourceId);
      if (response.success) {
        await fetchResources();
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      console.error("Error deleting resource:", err);
      return { success: false, error: "Failed to delete resource" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading resources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Render different UI based on user type
  if (isProfessor) {
    return (
      <ResourcesUIProfessor
        cohortId={cohortId}
        resources={resources}
        onCreateWeek={handleCreateWeek}
        onUpdateWeek={handleUpdateWeek}
        onDeleteWeek={handleDeleteWeek}
        onCreateResource={handleCreateResource}
        onUpdateResource={handleUpdateResource}
        onDeleteResource={handleDeleteResource}
      />
    );
  }

  return (
    <ResourcesUIStudent
      cohortId={cohortId}
      resources={resources}
    />
  );
};

export default CohortResourcesController;

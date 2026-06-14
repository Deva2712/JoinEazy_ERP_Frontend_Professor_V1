import React from "react";
import { Button } from "../../../../components/ui/button";

const DeleteConfirmDialog = ({ cohortData, isDeleting, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Course</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{cohortData?.name || cohortData?.title}"? This action
            cannot be undone and will permanently remove the course for all students.
          </p>
          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors font-medium"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
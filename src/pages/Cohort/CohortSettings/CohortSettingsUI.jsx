
// export default CohortSettingsUI;
import React from "react";
import { X, Upload } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import GroupSettings from "../CohortSettings/components/GroupSettings";
import DeleteConfirmDialog from "../CohortSettings/components/DeleteConfirmDialog";

const CohortSettingsUI = ({
  isOpen,
  onClose,
  onOverlayClick,
  form,
  onSave,
  cohortData,
  saveError,
  onImportParticipants,
  importParticipantsFile,
  maxGroupMembers,
  onMaxGroupMembersChange,
  minGroupMembers,
  onMinGroupMembersChange,
  maxCourseMembers,
  onMaxCourseMembersChange,
  deleteError,
  isDeleting,
  showDeleteConfirmation,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={onOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] lg:mx-4 mx-0 relative h-[100vh] md:h-auto md:max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Course Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">

              {/* Course Name */}
              <FormField
                control={form.control}
                name="cohortName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="block text-xs font-medium text-gray-900 dark:text-gray-100">Course Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter course name"
                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-0.5"
                      />
                    </FormControl>
                    {fieldState?.error && <FormMessage className="text-red-500 text-xs mt-0.5">{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* Course URL */}
              <FormField
                control={form.control}
                name="cohortUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="block text-xs font-medium text-gray-900 dark:text-gray-100">
                      Course URL (Give Onedrive / Google Drive , etc)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-0.5"
                      />
                    </FormControl>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      This will be used in the course URL. Only letters, numbers, hyphens, and underscores are allowed.
                    </p>
                    {fieldState?.error && <FormMessage className="text-red-500 text-xs mt-0.5">{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* Course Dates */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">Course Duration</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["startDate", "endDate"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            {name === "startDate" ? "Start Date" : "End Date"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="date"
                              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-0.5"
                            />
                          </FormControl>
                          {fieldState?.error && <FormMessage className="text-red-500 text-xs mt-0.5">{fieldState.error.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Group + Course Member Settings */}
              <GroupSettings
                minGroupMembers={minGroupMembers}
                onMinGroupMembersChange={onMinGroupMembersChange}
                maxGroupMembers={maxGroupMembers}
                onMaxGroupMembersChange={onMaxGroupMembersChange}
                maxCourseMembers={maxCourseMembers}
                onMaxCourseMembersChange={onMaxCourseMembersChange}
              />

              {/* Import Participants */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">Import Participants</h3>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">Import participants via emails from excel</p>
                <button
                  type="button"
                  onClick={onImportParticipants}
                  className="flex items-center justify-center px-3 gap-1.5 font-medium text-white transition-all duration-200"
                  style={{ height: "32px", borderRadius: "9999px", backgroundColor: "rgb(30, 97, 240)" }}
                >
                  <Upload size={14} />
                  <span className="text-xs">Import Participants</span>
                </button>
                {importParticipantsFile && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200"><strong>File selected:</strong> {importParticipantsFile.name}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">Click "Save Changes" to import participants and update course settings.</p>
                  </div>
                )}
              </div>

              {/* Save Error */}
              {saveError && <p className="text-red-500 text-sm w-full">{saveError}</p>}

              <Button
                type="button"
                onClick={form.handleSubmit(onSave)}
                className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </Button>

              {/* Delete Section - professors only */}
              {cohortData?.user_type === 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 space-y-4">
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900 dark:text-gray-100 mb-0.5">Delete Course</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      This action cannot be undone. This will permanently delete the course and remove all students from it.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={onDeleteClick}
                    disabled={isDeleting}
                    className="w-full py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors font-medium"
                  >
                    {isDeleting ? "Deleting..." : "Delete Course"}
                  </Button>
                  {deleteError && <p className="text-red-500 text-sm w-full">{deleteError}</p>}
                </div>
              )}

            </form>
          </Form>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmDialog
          cohortData={cohortData}
          isDeleting={isDeleting}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
        />
      )}
    </div>
  );
};

export default CohortSettingsUI;
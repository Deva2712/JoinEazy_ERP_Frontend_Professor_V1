
// import React, { useState } from "react";
// import { Plus, FileText, File } from "lucide-react";
// import { WeekModal, ResourceModal } from "../CohortResources/Modals/Resourcemodals";
// import WeekItem from "../CohortResources/components/WeekItem";
// import ResourceCard from "../CohortResources/components/ResourceCard";

// const ResourcesUIProfessor = ({
//   cohortId,
//   resources,
//   onCreateWeek,
//   onUpdateWeek,
//   onDeleteWeek,
//   onCreateResource,
//   onUpdateResource,
//   onDeleteResource,
// }) => {
//   const [selectedWeek, setSelectedWeek] = useState(resources?.weeks?.[0] || null);
//   const [showAddWeekModal, setShowAddWeekModal] = useState(false);
//   const [showAddResourceModal, setShowAddResourceModal] = useState(false);
//   const [editingWeek, setEditingWeek] = useState(null);
//   const [editingResource, setEditingResource] = useState(null);

//   const weeks = resources?.weeks || [];
//   const stats = resources?.stats || { totalWeeks: 0, totalResources: 0 };

//   const handleAddWeek = async (weekData) => {
//     const result = await onCreateWeek(weekData);
//     if (result.success) setShowAddWeekModal(false);
//     return result;
//   };

//   const handleUpdateWeek = async (weekId, weekData) => {
//     const result = await onUpdateWeek(weekId, weekData);
//     if (result.success) setEditingWeek(null);
//     return result;
//   };

//   const handleAddResource = async (resourceData) => {
//     if (!selectedWeek) return;
//     const result = await onCreateResource(selectedWeek.id, resourceData);
//     if (result.success) setShowAddResourceModal(false);
//     return result;
//   };

//   const handleUpdateResource = async (resourceId, resourceData) => {
//     const result = await onUpdateResource(resourceId, resourceData);
//     if (result.success) setEditingResource(null);
//     return result;
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"
//       style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}
//     >
//       <div className="max-w-[72rem] mx-auto px-4 pl-0 pr-4 pb-12 flex-grow">
   
//         {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"> */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

//           {/* Left Sidebar - Weekly Materials */}
//           <div className="lg:col-span-3">
//             {/* <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"> */}
//             <div className="bg-white dark:bg-gray-800 rounded-none border-r border-gray-200 dark:border-gray-700 overflow-hidden h-full">
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                 {/* FIX: heading + button now wrap onto separate lines on narrow widths instead of squeezing together */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
//                   <h2 className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
//                     Weekly Materials
//                   </h2>
//                   <button
//                     onClick={() => setShowAddWeekModal(true)}
//                     className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shrink-0 w-full sm:w-auto"
//                   >
//                     <Plus size={16} />
//                     Add Week
//                   </button>
//                 </div>

//                 {/* Week List */}
//                 <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
//                   {weeks.map((week) => (
//                     <WeekItem
//                       key={week.id}
//                       week={week}
//                       isSelected={selectedWeek?.id === week.id}
//                       onSelect={setSelectedWeek}
//                       onEdit={setEditingWeek}
//                       onDelete={onDeleteWeek}
//                     />
//                   ))}
//                 </div>

//                 {weeks.length === 0 && (
//                   <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
//                     No weeks added yet. Click "Add Week" to get started.
//                   </div>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="p-4 bg-white dark:bg-gray-800 flex items-center justify-around border-t border-gray-200 dark:border-gray-700">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWeeks}</div>
//                   <div className="text-xs text-gray-600 dark:text-gray-400">Total Weeks</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalResources}</div>
//                   <div className="text-xs text-gray-600 dark:text-gray-400">Total Resources</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Content - Resources */}
//           <div className="lg:col-span-9">
//             {selectedWeek ? (
//               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         Week {selectedWeek.weekNumber}: {selectedWeek.title}
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedWeek.dateRange}</p>
//                     </div>
//                     <button
//                       onClick={() => setShowAddResourceModal(true)}
//                       className="bg-blue-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 lg:gap-2 shrink-0 w-full sm:w-auto"
//                     >
//                       <Plus size={16} />
//                       <span className="hidden sm:inline">Add Resource</span>
//                       <span className="sm:hidden">Add</span>
//                     </button>
//                   </div>

//                   {/* Search Bar */}
//                   <div className="mt-4">
//                     <input
//                       type="text"
//                       placeholder="Search resources by title, description, or link"
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Resources List */}
//                 <div className="p-4">
//                   {selectedWeek.resources && selectedWeek.resources.length > 0 ? (
//                     <div className="space-y-3">
//                       {selectedWeek.resources.map((resource) => (
//                         <ResourceCard
//                           key={resource.id}
//                           resource={resource}
//                           onEdit={setEditingResource}
//                           onDelete={onDeleteResource}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//                       <File size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
//                       <p>No resources added yet</p>
//                       <p className="text-sm mt-1">Click "Add Resource" to add materials for this week</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
//                 <FileText size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
//                 <p className="text-gray-500 dark:text-gray-400">Select a week to view resources</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showAddWeekModal && (
//         <WeekModal
//           onClose={() => setShowAddWeekModal(false)}
//           onSave={handleAddWeek}
//           existingWeeks={weeks}
//         />
//       )}
//       {editingWeek && (
//         <WeekModal
//           onClose={() => setEditingWeek(null)}
//           onSave={(data) => handleUpdateWeek(editingWeek.id, data)}
//           week={editingWeek}
//           existingWeeks={weeks}
//         />
//       )}
//       {showAddResourceModal && (
//         <ResourceModal
//           onClose={() => setShowAddResourceModal(false)}
//           onSave={handleAddResource}
//         />
//       )}
//       {editingResource && (
//         <ResourceModal
//           onClose={() => setEditingResource(null)}
//           onSave={(data) => handleUpdateResource(editingResource.id, data)}
//           resource={editingResource}
//         />
//       )}
//     </div>
//   );
// };

// export default ResourcesUIProfessor;

import React, { useState } from "react";
import { Plus, FileText, File } from "lucide-react";
import { WeekModal, ResourceModal } from "../CohortResources/Modals/Resourcemodals";
import WeekItem from "../CohortResources/components/WeekItem";
import ResourceCard from "../CohortResources/components/ResourceCard";

const ResourcesUIProfessor = ({
  cohortId,
  resources,
  onCreateWeek,
  onUpdateWeek,
  onDeleteWeek,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(resources?.weeks?.[0] || null);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  const weeks = resources?.weeks || [];
  const stats = resources?.stats || { totalWeeks: 0, totalResources: 0 };

  const handleAddWeek = async (weekData) => {
    const result = await onCreateWeek(weekData);
    if (result.success) setShowAddWeekModal(false);
    return result;
  };

  const handleUpdateWeek = async (weekId, weekData) => {
    const result = await onUpdateWeek(weekId, weekData);
    if (result.success) setEditingWeek(null);
    return result;
  };

  const handleAddResource = async (resourceData) => {
    if (!selectedWeek) return;
    const result = await onCreateResource(selectedWeek.id, resourceData);
    if (result.success) setShowAddResourceModal(false);
    return result;
  };

  const handleUpdateResource = async (resourceId, resourceData) => {
    const result = await onUpdateResource(resourceId, resourceData);
    if (result.success) setEditingResource(null);
    return result;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"
      style={{ fontFamily: '"Roboto", system-ui, sans-serif' }}
    >
      <div className="w-full pl-0 pr-6 pt-4 pb-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Sidebar - Weekly Materials */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-r-lg border border-gray-200 dark:border-gray-700 overflow-hidden ">
              
              <div className="px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                {/* Heading + Button */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Weekly Materials
                  </h2>
                  <button
                    onClick={() => setShowAddWeekModal(true)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus size={16} />
                    Add Week
                  </button>
                </div>

                {/* Week List */}
                <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {weeks.map((week) => (
                    <WeekItem
                      key={week.id}
                      week={week}
                      isSelected={selectedWeek?.id === week.id}
                      onSelect={setSelectedWeek}
                      onEdit={setEditingWeek}
                      onDelete={onDeleteWeek}
                    />
                  ))}
                  {weeks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      No weeks added yet. Click "Add Week" to get started.
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 flex items-center justify-around border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWeeks}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Weeks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalResources}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Resources</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Resources */}
          <div className="lg:col-span-8">
            {selectedWeek ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-320px)]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Week {selectedWeek.weekNumber}: {selectedWeek.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedWeek.dateRange}</p>
                    </div>
                    <button
                      onClick={() => setShowAddResourceModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
                    >
                      <Plus size={16} />
                      Add Resource
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search resources by title, description, or link"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Resources List */}
                <div className="p-4">
                  {selectedWeek.resources && selectedWeek.resources.length > 0 ? (
                    <div className="space-y-3">
                      {selectedWeek.resources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onEdit={setEditingResource}
                          onDelete={onDeleteResource}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <File size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                      <p>No resources added yet</p>
                      <p className="text-sm mt-1">Click "Add Resource" to add materials for this week</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-320px)] flex items-center justify-center">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400">Select a week to view resources</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modals */}
      {showAddWeekModal && (
        <WeekModal
          onClose={() => setShowAddWeekModal(false)}
          onSave={handleAddWeek}
          existingWeeks={weeks}
        />
      )}
      {editingWeek && (
        <WeekModal
          onClose={() => setEditingWeek(null)}
          onSave={(data) => handleUpdateWeek(editingWeek.id, data)}
          week={editingWeek}
          existingWeeks={weeks}
        />
      )}
      {showAddResourceModal && (
        <ResourceModal
          onClose={() => setShowAddResourceModal(false)}
          onSave={handleAddResource}
        />
      )}
      {editingResource && (
        <ResourceModal
          onClose={() => setEditingResource(null)}
          onSave={(data) => handleUpdateResource(editingResource.id, data)}
          resource={editingResource}
        />
      )}
    </div>
  );
};

export default ResourcesUIProfessor;
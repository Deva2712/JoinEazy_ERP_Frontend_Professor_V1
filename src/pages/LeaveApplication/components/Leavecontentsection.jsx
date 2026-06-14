// // components/LeaveContentSection.jsx
// import React from "react";
// import { Plus, RefreshCw, Calendar } from "lucide-react";
// import LeaveRequestCard from "./LeaveRequestCard";
// import SubstitutionRequestCard from "./SubstitutionRequestCard";

// /**
//  * LeaveContentSection
//  *
//  * Props:
//  *   activeTab               {string}
//  *   displayRequests         {Array}
//  *   loading                 {boolean}
//  *   onRefresh               {() => void}
//  *   onOpenModal             {() => void}
//  *   onEdit                  {(item) => void}
//  *   onRespondToSubstitution {(id, response) => void}
//  */
// const LeaveContentSection = ({
//   activeTab,
//   displayRequests,
//   loading,
//   onRefresh,
//   onOpenModal,
//   onEdit,
//   onRespondToSubstitution,
// }) => (
//   <>
//     {/* Header row */}
//     <div className="flex items-center justify-between mb-6">
//       <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
//         {activeTab.replace("-", " ")}
//       </h3>
//       {activeTab === "my-leaves" && (
//         <div className="flex gap-2">
//           <button
//             onClick={onRefresh}
//             className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
//           >
//             <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
//           </button>
//           <button
//             onClick={onOpenModal}
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
//           >
//             <Plus className="size-4" /> Apply Leave
//           </button>
//         </div>
//       )}
//     </div>

//     {/* Cards */}
//     {displayRequests.length > 0 ? (
//       <div className="grid grid-cols-1 gap-4">
//         {displayRequests.map((item) =>
//           activeTab === "substitutions" ? (
//             <SubstitutionRequestCard
//               key={item.id}
//               app={item}
//               onRespond={onRespondToSubstitution}
//             />
//           ) : (
//             <LeaveRequestCard key={item.id} app={item} onEdit={onEdit} />
//           ),
//         )}
//       </div>
//     ) : (
//       <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
//         <Calendar className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
//         <h2 className="text-lg font-bold text-gray-900 dark:text-white">Empty</h2>
//         <p className="text-gray-500 dark:text-gray-400 text-sm">
//           No records found for this section.
//         </p>
//       </div>
//     )}
//   </>
// );

// export default LeaveContentSection;
// components/LeaveContentSection.jsx
import React from "react";
import { Plus, RefreshCw, Calendar } from "lucide-react";
import LeaveRequestCard from "./LeaveRequestCard";
import SubstitutionRequestCard from "./SubstitutionRequestCard";

const LeaveContentSection = ({
  activeTab,
  subTab,
  onSubTabChange,
  substitutionSubTabs = [],
  displayRequests,
  loading,
  onRefresh,
  onOpenModal,
  onEdit,
  onRespondToSubstitution,
}) => (
  <>
    {/* Header row */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
        {activeTab.replace(/-/g, " ")}
      </h3>
      {activeTab === "my-leaves" && (
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            <Plus className="size-4" /> Apply Leave
          </button>
        </div>
      )}
    </div>

    {/* Substitution sub-tabs */}
    {activeTab === "substitutions" && (
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-2xl w-fit">
        {substitutionSubTabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSubTabChange(key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              subTab === key
                ? "bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    )}

    {/* Cards */}
    {displayRequests.length > 0 ? (
      <div className="grid grid-cols-1 gap-4">
        {displayRequests.map((item) => {
          const key = item.id || item._id;
          if (activeTab === "substitutions" && subTab === "my-substitutes") {
            // Incoming: use SubstitutionRequestCard with accept/decline
            return (
              <SubstitutionRequestCard
                key={key}
                app={item}
                onRespond={onRespondToSubstitution}
              />
            );
          }
          // Outgoing substitutes OR my-leaves OR history: use LeaveRequestCard
          return <LeaveRequestCard key={key} app={item} onEdit={onEdit} />;
        })}
      </div>
    ) : (
      <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
        <Calendar className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {activeTab === "substitutions" && subTab === "my-substitutes"
            ? "No one has requested you as a substitute yet."
            : activeTab === "substitutions"
            ? "You haven't assigned any substitutes in your leave applications."
            : "No records found for this section."}
        </p>
      </div>
    )}
  </>
);

export default LeaveContentSection;
import React from "react";

const QuickDetails = ({
  quickDetails,
  getIconComponent,
  handleQuickDetailShare,
  quickDetailShareState,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm w-full h-fit">
      <h3 className="text-xs font-bold mb-2.5 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
        Quick Details
      </h3>

      <div className="space-y-1.5">
        {quickDetails?.map((detail) => {
          const IconComponent = getIconComponent(detail.icon);

          if (detail.isShareable) {
            return (
              <button
                key={detail.id}
                onClick={handleQuickDetailShare}
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <IconComponent
                  size={16}
                  className={
                    quickDetailShareState.clicked
                      ? "text-green-600"
                      : "text-blue-600 dark:text-blue-400"
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    quickDetailShareState.clicked
                      ? "text-green-600"
                      : "text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {quickDetailShareState.clicked
                    ? "Copied to Clipboard"
                    : detail.text}
                </span>
              </button>
            );
          }

          return (
            <div
              key={detail.id}
              className="flex items-center gap-2 px-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <IconComponent
                size={14}
                className="text-gray-500 dark:text-gray-400 flex-shrink-0"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {detail.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickDetails;
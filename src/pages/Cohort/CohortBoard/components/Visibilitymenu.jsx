import React, { useState } from "react";
import { Eye, ChevronDown, Users, Badge, Search } from "lucide-react";

const VisibilityMenu = ({ user_type, memberType, membersList = [], groupsList = [] }) => {
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState("Everyone");
  const [memberSearch, setMemberSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  const getOptions = () => {
    const opts = ["Everyone"];
    if (user_type === 0) opts.push("Admin");
    if (user_type === 1) {
      opts.push("Select Member");
      if (memberType === 1) opts.push("Select Group");
    }
    return opts;
  };

  const handleSelect = (option) => {
    if (option === "Select Member") { setShowMemberSelector(true); setShowVisibilityMenu(false); }
    else if (option === "Select Group") { setShowGroupSelector(true); setShowVisibilityMenu(false); }
    else { setVisibilityOption(option); setShowVisibilityMenu(false); }
  };

  const isAnyOpen = showVisibilityMenu || showMemberSelector || showGroupSelector;
  const filteredMembers = membersList.filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()));
  const filteredGroups = groupsList.filter((g) => g.name.toLowerCase().includes(groupSearch.toLowerCase()));

  const optionDescriptions = {
    Everyone: "All cohort members",
    Admin: "Only administrators",
    "Select Member": "Choose specific member",
    "Select Group": "Choose specific group",
  };

  const popupStyle = {
    borderRadius: "16px",
    boxShadow: "0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
  };

  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => { setShowVisibilityMenu(!showVisibilityMenu); setShowMemberSelector(false); setShowGroupSelector(false); }}
        className="flex items-center gap-2 text-sm text-[#275DF5] transition-colors">
        <Eye size={16} className="sm:mt-[1px]" />
        <span>{visibilityOption}</span>
        <ChevronDown size={14} className={`transition-transform ${isAnyOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Visibility Options */}
      {showVisibilityMenu && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] z-50 min-w-[280px]" style={popupStyle}>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-black mb-1">Who can see this?</h3>
            <p className="text-sm text-gray-600 mb-4">Choose who has access to view this content</p>
            <div className="space-y-1">
              {getOptions().map((option) => (
                <button key={option} onClick={() => handleSelect(option)}
                  className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  style={{ fontWeight: visibilityOption === option ? "600" : "normal", backgroundColor: visibilityOption === option ? "#f3f4f6" : "transparent" }}>
                  {option === "Admin" ? <Badge size={16} className="text-gray-500" /> : <Users size={16} className="text-gray-500" />}
                  <div>
                    <div className="font-medium text-gray-900">{option}</div>
                    <div className="text-xs text-gray-500">{optionDescriptions[option]}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Member Selector */}
      {showMemberSelector && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] z-50 min-w-[320px]" style={popupStyle}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-black">Select Member</h3>
              <button onClick={() => setShowMemberSelector(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search members..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredMembers.map((member) => (
                <button key={member.id}
                  onClick={() => { setVisibilityOption(`Member: ${member.name}`); setShowMemberSelector(false); setMemberSearch(""); }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-900">{member.name}</span>
                </button>
              ))}
              {filteredMembers.length === 0 && <div className="text-center py-4 text-sm text-gray-500">No members found</div>}
            </div>
          </div>
        </div>
      )}

      {/* Group Selector */}
      {showGroupSelector && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] z-50 min-w-[320px]" style={popupStyle}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-black">Select Group</h3>
              <button onClick={() => setShowGroupSelector(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" value={groupSearch} onChange={(e) => setGroupSearch(e.target.value)} placeholder="Search groups..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredGroups.map((group) => (
                <button key={group.id}
                  onClick={() => { setVisibilityOption(`Group: ${group.name}`); setShowGroupSelector(false); setGroupSearch(""); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{group.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{group.memberCount} members</span>
                </button>
              ))}
              {filteredGroups.length === 0 && <div className="text-center py-4 text-sm text-gray-500">No groups found</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisibilityMenu;
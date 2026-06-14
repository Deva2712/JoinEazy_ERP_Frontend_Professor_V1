import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const pillStyle = (isActive) => ({
  height: 38, borderRadius: 9999, border: "1px solid #D3D6DA",
  paddingLeft: 16, paddingRight: 16, fontSize: 14, backgroundColor: "white",
  color: isActive ? "#275DF5" : "rgb(55, 65, 81)", fontWeight: 500,
});

const LeaderboardFilters = ({ member_type, memberType, range, handleMemberTypeChange, handleRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center gap-x-3.5 sm:gap-x-4 px-4 sm:px-0 mb-5 sm:mb-6">
      {member_type === 1 && (
        <div className="relative" ref={ref}>
          <button onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 font-medium bg-white transition-all duration-200"
            style={pillStyle(false)}>
            <span>{memberType}</span>
            <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg z-10 rounded-lg border border-[#D3D6DA] min-w-[140px]">
              {["Group", "Individual"].map((opt) => (
                <button key={opt} onClick={() => { handleMemberTypeChange(opt); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium transition-colors first:rounded-t-lg last:rounded-b-lg"
                  style={{ fontSize: 15, color: memberType === opt ? "#000" : "#666" }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full flex items-center gap-x-3.5 sm:gap-x-4 overflow-x-auto">
        {["This month", "All Time"].map((opt) => (
          <button key={opt} onClick={() => handleRange(opt)}
            className="flex items-center justify-center bg-white font-medium whitespace-nowrap transition-all duration-200"
            style={pillStyle(range === opt)}>
            {opt}
          </button>
        ))}
        <Link to="/how-points-work" className="sm:ml-auto flex items-center justify-center whitespace-nowrap font-medium"
          style={{ ...pillStyle(false), textDecoration: "none" }}>
          How points work?
        </Link>
      </div>
    </div>
  );
};

export default LeaderboardFilters;
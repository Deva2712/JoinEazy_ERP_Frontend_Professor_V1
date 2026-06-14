const medalStyles = {
  gold:   { backgroundColor: "#fad946", color: "#9e7b2b" },
  silver: { backgroundColor: "#d1dceb", color: "#7b869e" },
  bronze: { backgroundColor: "#d9a068", color: "#8a5f3a" },
};

const MedalIcon = ({ medalType, rank }) => {
  const style = medalStyles[medalType];
  return (
    <div className="flex items-center justify-center rounded-full font-bold text-sm"
      style={{ width: 26, height: 26, color: style?.color ?? "#374151", backgroundColor: style?.backgroundColor }}>
      {rank}
    </div>
  );
};

const LeaderboardRow = ({ user, medalType, showProfileImage }) => (
  <div className="flex items-center px-4 py-3.5 sm:px-6 sm:py-4 gap-x-3 sm:gap-x-4">
    <div className="flex-shrink-0">
      <MedalIcon medalType={medalType} rank={user.rank} />
    </div>

    {showProfileImage && (
      <div className="flex-shrink-0 rounded-full w-9 h-9 sm:w-10 sm:h-10 overflow-hidden">
        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
      </div>
    )}

    <div className="flex-grow min-w-0">
      <h4 className="font-medium text-gray-900 text-[15px] sm:text-base line-clamp-1">{user.name}</h4>
      <p className="text-gray-700 text-sm line-clamp-1 mt-[-1px]">{user.description}</p>
    </div>

    <span className="ml-auto flex-shrink-0 font-bold text-sm sm:text-[15px]" style={{ color: "#275DF5" }}>
      {user.points.toLocaleString()}
    </span>
  </div>
);

export default LeaderboardRow;
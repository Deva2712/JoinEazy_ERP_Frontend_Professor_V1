// export default CohortLeaderboardUI;

import LeaderboardFilters from "../CohortLeaderboard/components/LeaderboardFilters";
import LeaderboardRow from "../CohortLeaderboard/components/LeaderboardRow";

const CohortLeaderboardUI = ({ member_type, memberType, range, leaderboardData,
  handleMemberTypeChange, handleRange, getMedalType }) => {

  const mainList = leaderboardData.slice(0, -1);
  const lastUser = leaderboardData[leaderboardData.length - 1];

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7">
      <LeaderboardFilters member_type={member_type} memberType={memberType} range={range}
        handleMemberTypeChange={handleMemberTypeChange} handleRange={handleRange} />

      <div className="px-4 sm:px-0">
        {/* Main list */}
        {mainList.length > 0 && (
          <div className="bg-white rounded-[20px] overflow-hidden mb-5 sm:mb-6 border border-[#D3D6DA] divide-y divide-[#D3D6DA]">
            {mainList.map((user) => (
              <LeaderboardRow key={user.id} user={user} getMedalType={getMedalType(user.rank)} showProfileImage={false} />
            ))}
          </div>
        )}

        {/* Last item (current user) */}
        {lastUser && (
          <div className="bg-white rounded-[18px] overflow-hidden border border-[#D3D6DA]">
            <LeaderboardRow user={lastUser} getMedalType={getMedalType(lastUser.rank)}
              showProfileImage={memberType === "Individual"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CohortLeaderboardUI;
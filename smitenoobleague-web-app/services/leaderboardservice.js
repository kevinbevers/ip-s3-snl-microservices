import helpers from "utils/helpers";

const GetLeaderboardData = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/leaderboard/data/${divisionID}`);
  };

  

export default {
    GetLeaderboardData,
}
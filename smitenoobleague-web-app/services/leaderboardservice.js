import helpers from "utils/helpers";

const GetLeaderboardData = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/leaderboard/data/");
  };

  

export default {
    GetLeaderboardData,
}
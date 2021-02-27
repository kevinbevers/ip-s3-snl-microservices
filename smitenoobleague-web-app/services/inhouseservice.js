import helpers from "utils/helpers";

const GetInhouseHistoryDetailsByGameID = async(gameID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`inhouse-service/matchstat/matchhistorybygameid/${gameID}`);
};

const GetInhouseHistoryList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`inhouse-service/matchstat/getmatchhistory/${pageSize}/${index}`);
};

const GetInhouseLeaderboardData = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("inhouse-service/leaderboard/data/");
  };

  const GetInhouseLeaderboardDataLandingPage = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("inhouse-service/leaderboard/data/landing");
  };

  const DeleteMatchByGameID = async(apiToken,gameID) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.delete(`inhouse-service/matchstat/${gameID}`);
  };

  const SubmitInhouseGameID = async(apiToken,gameID) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.post(`smiteapi-service/match/inhouse`, gameID);
  };

  

export default {
    GetInhouseHistoryDetailsByGameID,
    GetInhouseHistoryList,
    GetInhouseLeaderboardData,
    GetInhouseLeaderboardDataLandingPage,
    DeleteMatchByGameID,
    SubmitInhouseGameID
}
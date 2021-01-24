import helpers from "utils/helpers";

const GetMatchupHistoryByMatchupID = async(matchupID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/matchstat/matchhistorybymatchupid/${matchupID}`);
};

const GetMatchupHistoryList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/matchstat/getmatchhistory/${pageSize}/${index}`);
};

  

export default {
    GetMatchupHistoryByMatchupID,
    GetMatchupHistoryList
}
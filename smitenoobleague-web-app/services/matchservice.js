import helpers from "utils/helpers";

const GetMatchupHistoryByMatchupID = async(matchupID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/matchstat/matchhistorybymatchupid/${matchupID}`);
};

const GetMatchupHistoryList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/matchstat/getmatchhistory/${pageSize}/${index}`);
};

const ForfeitMatchup = async(data, apiToken) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.post(`stat-service/matchstat/forfeitmatch`, data);
};

  

export default {
    GetMatchupHistoryByMatchupID,
    GetMatchupHistoryList,
    ForfeitMatchup
}
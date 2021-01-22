import helpers from "utils/helpers";

const GetMatchupHistoryByMatchupID = async(matchupID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/matchstat/matchhistorybymatchupid/" + matchupID);
};

  

export default {
    GetMatchupHistoryByMatchupID
}
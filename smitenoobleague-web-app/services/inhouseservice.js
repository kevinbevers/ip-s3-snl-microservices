import helpers from "utils/helpers";

const GetInhouseHistoryDetailsByGameID = async(gameID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`inhouse-service/matchstat/matchhistorybygameid/${gameID}`);
};

const GetInhouseHistoryList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`inhouse-service/matchstat/getmatchhistory/${pageSize}/${index}`);
};

  

export default {
    GetInhouseHistoryDetailsByGameID,
    GetInhouseHistoryList
}
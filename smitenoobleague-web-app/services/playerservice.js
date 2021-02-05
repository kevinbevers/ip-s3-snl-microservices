import helpers from "utils/helpers";

const GetListOfPlayersByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/player/bydivision/" + divisionID);
  };

  const GetPlayerStatisticsByPlayerID = async(playerID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/playerstat/byplayerid/" + playerID);
  };

  const GetPlayerPickPercentagesByPlayerID = async(playerID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/playerstat/pickpercentagesbyplayerid/" + playerID);
  };

export default {
    GetListOfPlayersByDivisionID,
    GetPlayerStatisticsByPlayerID,
    GetPlayerPickPercentagesByPlayerID
}
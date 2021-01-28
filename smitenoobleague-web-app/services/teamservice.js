import helpers from "utils/helpers";

const GetListOfTeamsByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/Team/bydivision/" + divisionID);
  };

  const GetListOfTeamsWithDetailsByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/Team/bydivisionwithdetails/" + divisionID);
  };

  const GetListOfTeamsWithoutDivisions = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/Team/divisionless");
  };

  const GetListOfTeamsWithDetailsWithoutDivisions = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/Team/divisionlesswithdetails");
  };

  const GetTeamStatisticsByTeamID = async(teamID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/teamstat/byteamid/" + teamID);
  };

  const GetTeamPickPercentagesByTeamID = async(teamID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/teamstat/pickpercentagesbyteamid/" + teamID);
  };

  

export default {
    GetListOfTeamsByDivisionID,
    GetListOfTeamsWithDetailsByDivisionID,
    GetListOfTeamsWithoutDivisions,
    GetListOfTeamsWithDetailsWithoutDivisions,
    GetTeamStatisticsByTeamID,
    GetTeamPickPercentagesByTeamID
}
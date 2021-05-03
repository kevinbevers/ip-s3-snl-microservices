import helpers from "utils/helpers";

const GetTeamByID = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.get("team-service/Team/" + data);
};

const GetAllTeams = async() => {
  const apiClient = await helpers.BuildApiClient(null);
  return apiClient.get("team-service/Team/");
};

const SetTeamsDivision = async(apiToken,data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.post("team-service/Team/setdivisionforteams", data);
};

const DeleteTeamByID = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.delete("team-service/Team/" + data);
};

const AddNewTeam = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.post("team-service/Team/", data);
};

const UpdateTeamAsAdmin = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.put("team-service/team/admin", data);
};

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

  const GetTeamMatchHistoryWithPageAndTeamID = async(teamID, page) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`stat-service/teamstat/getrecentmatchpage/${teamID}/${page}/`);
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
    GetTeamPickPercentagesByTeamID,
    GetTeamByID,
    DeleteTeamByID,
    AddNewTeam,
    UpdateTeamAsAdmin,
    GetAllTeams,
    SetTeamsDivision,
    GetTeamMatchHistoryWithPageAndTeamID
}
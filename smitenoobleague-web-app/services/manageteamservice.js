import helpers from "utils/helpers";

const GetPlayersByName = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.get("smiteapi-service/player/" + data);
  };
  
  const AddPlayerToTeam = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.post("team-service/team/teammember", data);
  };
  
  const UpdatePlayerToTeam = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.put("team-service/team/updatemember", data);
  };

  const RemovePlayerFromTeam = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.delete("team-service/team/teammember/" + data);
  };

export default {
  GetPlayersByName,
  AddPlayerToTeam,
  UpdatePlayerToTeam,
  RemovePlayerFromTeam
}
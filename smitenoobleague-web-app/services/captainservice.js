import helpers from "utils/helpers";

const baseServiceAddress = "team-service"

const GetTeamByID = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.get(baseServiceAddress + "/team/" + data);
};

const GetTeamByCaptainID = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.get(baseServiceAddress + "/team/bycaptainid/" + data, { timeout: 5000 });
};

const UpdatePlayerRole = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.put(baseServiceAddress + "/team/updaterole", data);
};

const UpdateTeamInfo = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClientForm(apiToken);
  return apiClient.put(baseServiceAddress + "/team", data);
};

const SubmitMatchID = async(apiToken, data) => {
  const apiClient = await helpers.BuildApiClient(apiToken);
  return apiClient.post("smiteapi-service/match", data);
};

export default {
  GetTeamByID,
  UpdatePlayerRole,
  UpdateTeamInfo,
  SubmitMatchID,
  GetTeamByCaptainID
}
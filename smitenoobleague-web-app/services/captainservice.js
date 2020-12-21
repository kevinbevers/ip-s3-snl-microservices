import axios from "axios";

const baseServiceAddress = "team-service"

const GetTeamByID = async(apiToken, data) => {
    const apiClient = await BuildApiClient(apiToken);
    return apiClient.get(baseServiceAddress + "/team/" + data);
};

const UpdatePlayerRole = async(apiToken, data) => {
  const apiClient = await BuildApiClient(apiToken);
  return apiClient.put(baseServiceAddress + "/team/updaterole", data);
};

const UpdateTeamInfo = async(apiToken, data) => {
  const apiClient = await BuildApiClient(apiToken);
  return apiClient.put(baseServiceAddress + "/team", data);
};

const SubmitMatchID = async(apiToken, data) => {
  const apiClient = await BuildApiClient(apiToken);
  return apiClient.post("smiteapi-service/match", data);
};

const BuildApiClient = async(apiToken) => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    });
  };

export default {
  GetTeamByID,
  UpdatePlayerRole,
  UpdateTeamInfo,
  SubmitMatchID,
}
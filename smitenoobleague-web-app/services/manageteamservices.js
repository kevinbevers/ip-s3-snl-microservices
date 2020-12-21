import axios from "axios";

const GetPlayersByName = async(apiToken, data) => {
    const apiClient = await BuildApiClient(apiToken);
    return apiClient.get("smiteapi-service/player/" + data);
  };
  
  const AddPlayerToTeam = async(apiToken, data) => {
    const apiClient = await BuildApiClient(apiToken);
    return apiClient.post("team-service/team/teammember", data);
  };
  
  const UpdatePlayerToTeam = async(apiToken, data) => {
    const apiClient = await BuildApiClient(apiToken);
    return apiClient.put("team-service/team/updatemember", data);
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
  GetPlayersByName,
  AddPlayerToTeam,
  UpdatePlayerToTeam
}
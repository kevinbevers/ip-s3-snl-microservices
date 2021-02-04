import helpers from "utils/helpers";

const GetBasicListOfDivisions = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Division");
  };

  const DeleteDivisionByID = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.delete("division-service/Division/" + data);
  };

  const UpdateDivision = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.put("division-service/Division", data);
  };

  const CreateDivision = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClientForm(apiToken);
    return apiClient.post("division-service/Division", data);
  };

export default {
    GetBasicListOfDivisions,
    DeleteDivisionByID,
    UpdateDivision,
    CreateDivision
}
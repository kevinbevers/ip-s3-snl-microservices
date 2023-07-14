import helpers from "utils/helpers";

const GetListOfItems = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("smiteapi-service/Item");
  };

  const GetListOfGods = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("smiteapi-service/God");
  };

export default {
    GetListOfItems,
    GetListOfGods
}
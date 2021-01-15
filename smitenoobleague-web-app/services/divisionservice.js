import axios from "axios";
import helpers from "utils/helpers";

const GetBasicListOfDivisions = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Division");
  };

export default {
    GetBasicListOfDivisions,
}
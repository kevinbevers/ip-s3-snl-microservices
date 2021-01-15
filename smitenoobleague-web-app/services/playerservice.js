import axios from "axios";
import helpers from "utils/helpers";

const GetListOfPlayersByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("team-service/player/bydivision/" + divisionID);
  };

  

export default {
    GetListOfPlayersByDivisionID
}
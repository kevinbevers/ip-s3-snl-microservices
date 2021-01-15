import axios from "axios";
import helpers from "utils/helpers";

const GetBasicListOfDivisions = async() => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Division");
  };
  
  const GetListOfSchedulesByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Schedule/allids&names-bydivisionid/" + divisionID);
  };
  
  const GetScheduleDetailsByScheduleID = async(scheduleID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Schedule/byscheduleid/" + scheduleID);
  };

  const GetCurrentScheduleIdByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Schedule/currentschedulebydivisionid/" + divisionID);
  };

  const GetAllSchedulesByDivisionID = async(divisionID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("division-service/Schedule/all-bydivisionid/" + divisionID);
  };

export default {
    GetBasicListOfDivisions,
    GetListOfSchedulesByDivisionID,
    GetScheduleDetailsByScheduleID,
    GetCurrentScheduleIdByDivisionID,
    GetAllSchedulesByDivisionID
}
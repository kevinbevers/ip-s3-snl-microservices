import helpers from "utils/helpers";
  
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

  const DeleteScheduleByScheduleID = async(apiToken, scheduleID) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.delete("division-service/Schedule/byscheduleid/" + scheduleID);
  };

  const UpdateSchedule = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.put("/division-service/Schedule/", data);
  };

  const CreateSchedule = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.post("/division-service/Schedule/", data);
  };

export default {
    GetListOfSchedulesByDivisionID,
    GetScheduleDetailsByScheduleID,
    GetCurrentScheduleIdByDivisionID,
    GetAllSchedulesByDivisionID,
    DeleteScheduleByScheduleID,
    UpdateSchedule,
    CreateSchedule
}
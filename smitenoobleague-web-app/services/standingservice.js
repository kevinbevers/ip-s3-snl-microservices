import helpers from "utils/helpers";
  
  const GetStandingsByScheduleID = async(scheduleID) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get("stat-service/standing/standingbyscheduleid/" + scheduleID);
  };

export default {
  GetStandingsByScheduleID,
}
  
import auth0 from "utils/auth0";
import axios from "axios";

const GetLoginSession = async(req) => {
  //get session
  const session = await auth0.getSession(req);
  //Check if logged in user is captain to show captainpage in navbar
  let Captain = false;

  if(session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Captain"))
  {
    Captain = true;
  }
  else {
    Captain = false;
  }

  return {
          user: session?.user || null,
          isCaptain: Captain
        };
};

const GetSecureApi = async(req, res) => {

  const tokenCache = auth0.tokenCache(req, res);
  const { accessToken } = await tokenCache.getAccessToken();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default {
  GetLoginSession,
  GetSecureApi
}
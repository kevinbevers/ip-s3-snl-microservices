 import auth0 from "utils/auth0";
import axios from "axios";

const GetLoginSession = async(req) => {
  //get session
  const session = await auth0.getSession(req);
  //Check if logged in user is captain to show captainpage in navbar
  let Captain = session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Captain") ? true : false;
  let Mod = session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Mod") ? true : false;
  let Admin = session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Admin") ? true : false;

  return {
          user: session?.user || null,
          isCaptain: Captain,
          isMod: Mod,
          isAdmin: Admin
        };
};
//used in server side for autorized calls
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
//token for client side
const GetAccessTokenForClient = async(req, res) => {

  const tokenCache = auth0.tokenCache(req, res);
  const { accessToken } = await tokenCache.getAccessToken();

  return accessToken;
};
//used in client side for authorized calls
const BuildApiClient = async(apiToken) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
};

const BuildApiClientForm = async(apiToken) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/",
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: `Bearer ${apiToken}`,
    },
  });
};


export default {
  GetLoginSession,
  GetSecureApi,
  GetAccessTokenForClient,
  BuildApiClient,
  BuildApiClientForm
}
import helpers from "utils/helpers";
  
const GetArticleList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`news-service/article/all/${pageSize}/${index}`);
};

const GetArticleBySlug = async(slug) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`news-service/article/${slug}`);
};

export default {
    GetArticleList,
    GetArticleBySlug
}
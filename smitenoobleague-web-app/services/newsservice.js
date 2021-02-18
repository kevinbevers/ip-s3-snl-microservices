import helpers from "utils/helpers";
  
const GetArticleList = async(pageSize,index) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`news-service/article/all/${pageSize}/${index}`);
};

const GetArticleBySlug = async(slug) => {
    const apiClient = await helpers.BuildApiClient(null);
    return apiClient.get(`news-service/article/${slug}`);
};

const CreateArticle = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.post(`news-service/article`, data);
};

const EditArticle = async(apiToken, data) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.put(`news-service/article`, data);
};

const DeleteArticle = async(apiToken, slug) => {
    const apiClient = await helpers.BuildApiClient(apiToken);
    return apiClient.delete(`news-service/article/${slug}`);
};


export default {
    GetArticleList,
    GetArticleBySlug,
    CreateArticle,
    EditArticle,
    DeleteArticle
}
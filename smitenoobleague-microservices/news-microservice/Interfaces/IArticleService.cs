using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using news_microservice.Models.External;

namespace news_microservice.Interfaces
{
    public interface IArticleService
    {
        Task<ActionResult<IEnumerable<Article>>> GetNewsOverviewAsync(int pageSize, int index);
        Task<ActionResult<ArticleWithContent>> GetNewsArticleBySlugAsync(string slug);
        Task<ActionResult> CreateNewsArticleAsync(ArticleWithContent article);
        Task<ActionResult<ArticleWithContent>> EditNewsArticleAsync(ArticleWithContent article);
        Task<ActionResult> DeleteNewsArticleAsync(string slug);
    }
}

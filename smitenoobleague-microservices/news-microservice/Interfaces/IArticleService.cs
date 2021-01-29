using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using news_microservice.Models.External;

namespace news_microservice.Interfaces
{
    public interface IArticleService
    {
        Task<ActionResult<List<Article>>> GetNewsOverviewAsync();
        Task<ActionResult<ArticleWithContent>> GetNewsArticleBySlugAsync(string slug);
        Task<ActionResult<ArticleWithContent>> CreateNewsArticleAsync(ArticleWithContent arti);
        Task<ActionResult<ArticleWithContent>> EditNewsArticleAsync(ArticleWithContent article);
        Task<ActionResult> DeleteNewsArticleAsync(string slug);
    }
}

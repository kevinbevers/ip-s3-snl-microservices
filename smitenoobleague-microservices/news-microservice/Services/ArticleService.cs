using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using news_microservice.Interfaces;
using news_microservice.Models.External;
using news_microservice.News_DB;

namespace news_microservice.Services
{
    public class ArticleService : IArticleService
    {
        private readonly SNL_News_DBContext _db;
        private readonly ILogger<ArticleService> _logger;

        public ArticleService(SNL_News_DBContext db, ILogger<ArticleService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public Task<ActionResult<ArticleWithContent>> CreateNewsArticleAsync(ArticleWithContent article)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult> DeleteNewsArticleAsync(string slug)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<ArticleWithContent>> EditNewsArticleAsync(ArticleWithContent article)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<ArticleWithContent>> GetNewsArticleBySlugAsync(string slug)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<List<Article>>> GetNewsOverviewAsync()
        {
            throw new NotImplementedException();
        }
    }
}

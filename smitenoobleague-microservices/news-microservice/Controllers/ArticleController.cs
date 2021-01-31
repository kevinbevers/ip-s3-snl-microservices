using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using news_microservice.Interfaces;
using news_microservice.Models.External;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace news_microservice.Controllers
{
    [Route("[controller]")]
    public class ArticleController : Controller
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }


        // GET: news-service/article
        [HttpGet("all/{pageSize}/{index}")]
        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticless(int pageSize = 8, int index = 0)
        {
            return await _articleService.GetNewsOverviewAsync(pageSize, index);
        }

        // GET news-service/article/{slug}
        [HttpGet("{slug}")]
        public async Task<ActionResult<ArticleWithContent>> GetArticle(string slug)
        {
            return await _articleService.GetNewsArticleBySlugAsync(slug);
        }

        // POST  news-service/article
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateArticle([FromBody] ArticleWithContent article)
        {
          return ModelState.IsValid ? await _articleService.CreateNewsArticleAsync(article) : BadRequest(ModelState);
        }

        // PUT  news-service/article
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ArticleWithContent>> UpdateArticle([FromBody] ArticleWithContent article)
        {
            return ModelState.IsValid ? await _articleService.EditNewsArticleAsync(article) : BadRequest(ModelState);
        }

        // DELETE  news-service/article/{slug}
        [HttpDelete("{slug}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteArticle(string slug)
        {
            return await _articleService.DeleteNewsArticleAsync(slug);
        }
    }
}

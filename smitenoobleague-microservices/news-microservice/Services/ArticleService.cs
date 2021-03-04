using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using news_microservice.Interfaces;
using news_microservice.Models.External;
using news_microservice.News_DB;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using news_microservice.Classes;
using Microsoft.AspNetCore.Hosting;

namespace news_microservice.Services
{
    public class ArticleService : IArticleService
    {
        private readonly SNL_News_DBContext _db;
        private readonly ILogger<ArticleService> _logger;
        private readonly IWebHostEnvironment _env;

        public ArticleService(SNL_News_DBContext db, ILogger<ArticleService> logger, IWebHostEnvironment env)
        {
            _db = db;
            _logger = logger;
            _env = env;
        }

        public async Task<ActionResult> CreateNewsArticleAsync(ArticleWithContent article)
        {
            try
            {
                string articleSlug = Regex.Replace(article.ArticleTitle?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();

                ArticleTable foundArticle = await _db.ArticleTables.Where(t => t.ArticleSlug == articleSlug).FirstOrDefaultAsync();
                if (foundArticle != null)
                {
                    return new ObjectResult("Article with slug already exists.") { StatusCode = 400 };
                }
                else
                {
                    ArticleTable articleToAdd = new ArticleTable
                    {
                        ArticleSlug = articleSlug,
                        ArticleDatePosted = DateTime.Now,
                        ArticleTitle = article?.ArticleTitle,
                        ArticleContent = article?.ArticleContent,
                        ArticleDescription = article?.ArticleDescription,
                        ArticleType = article?.ArticleType,
                        ArticleImagePath = article.ArticleImageFile != null ?  await ImageProcessing.SaveImageAsync(article.ArticleImageFile, articleSlug, _env) : null
                    };

                    _db.ArticleTables.Add(articleToAdd);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Article successfully created.") { StatusCode = 201 };
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to create article.");
                //return result to client
                return new ObjectResult("Something went wrong trying to create article.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> DeleteNewsArticleAsync(string slug)
        {
            try
            {
                ArticleTable foundArticle = await _db.ArticleTables.Where(t => t.ArticleSlug == slug).FirstOrDefaultAsync();
                if (foundArticle != null)
                {
                    _db.ArticleTables.Remove(foundArticle);
                    if (foundArticle.ArticleImagePath != null)
                    {
                        ImageProcessing.DeleteImageAsync(foundArticle.ArticleImagePath, _env);
                    }
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Article successfully deleted.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No Article found with given slug.") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete article by slug.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete article by slug.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<ArticleWithContent>> EditNewsArticleAsync(ArticleWithContent article)
        {
            try
            {
                ArticleTable foundArticle = await _db.ArticleTables.Where(t => t.ArticleSlug == article.ArticleSlug).FirstOrDefaultAsync();
                if (foundArticle != null)
                {
                    //check if slug needs to be changed
                    if(foundArticle.ArticleTitle != article.ArticleTitle)
                    {
                        string articleSlug = Regex.Replace(article.ArticleTitle?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();

                        ArticleTable articleToAdd = new ArticleTable
                        {
                            ArticleSlug = articleSlug,
                            ArticleDatePosted = DateTime.Now,
                            ArticleTitle = article.ArticleTitle,
                            ArticleContent = article.ArticleContent,
                            ArticleDescription = article.ArticleDescription,
                            ArticleType = article.ArticleType,
                        };

                        //add or remove image when an image path is set 
                        if (article?.ArticleImagePath != null)
                        {
                            if (foundArticle?.ArticleImagePath != null && (bool)!article?.ArticleImagePath.Contains(foundArticle.ArticleImagePath))
                            {
                                //Delete the old team logo. old images should be deleted to keep the disk from being bombarded with images.
                                ImageProcessing.DeleteImageAsync(foundArticle.ArticleImagePath, _env);
                            }

                            if (article.ArticleImageFile != null)
                            {
                                articleToAdd.ArticleImagePath = await ImageProcessing.SaveImageAsync(article.ArticleImageFile, articleSlug, _env);
                            }
                        }

                        //remove the article with the old slug
                        _db.ArticleTables.Remove(foundArticle);
                        ImageProcessing.DeleteImageAsync(foundArticle.ArticleSlug, _env);
                        //add the new one
                        _db.ArticleTables.Add(articleToAdd);
                        await _db.SaveChangesAsync();

                        return new ObjectResult("Article successfully updated, including slug change.") { StatusCode = 200 }; //OK
                    }
                    else
                    {
                        foundArticle.ArticleContent = article.ArticleContent != null ? article.ArticleContent : foundArticle.ArticleContent;
                        foundArticle.ArticleDescription = article.ArticleDescription != null ? article.ArticleDescription : foundArticle.ArticleDescription;
                        foundArticle.ArticleType = article.ArticleType != null ? article.ArticleType : foundArticle.ArticleType;

                        //add or remove image when an image path is set 
                        if (article?.ArticleImagePath != null)
                        {
                            if (foundArticle?.ArticleImagePath != null && (bool)!article?.ArticleImagePath.Contains(foundArticle.ArticleImagePath))
                            {
                                //Delete the old team logo. old images should be deleted to keep the disk from being bombarded with images.
                                ImageProcessing.DeleteImageAsync(foundArticle.ArticleImagePath, _env);
                                foundArticle.ArticleImagePath = null;
                            }

                            if (article.ArticleImageFile != null)
                            {
                                foundArticle.ArticleImagePath = await ImageProcessing.SaveImageAsync(article.ArticleImageFile, foundArticle.ArticleSlug, _env);
                            }
                        }

                        _db.ArticleTables.Update(foundArticle);
                        await _db.SaveChangesAsync();

                        return new ObjectResult("Article successfully updated.") { StatusCode = 200 }; //OK
                    }
                }
                else
                {
                    return new ObjectResult("No Article found with given slug.") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update article.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update article.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<ArticleWithContent>> GetNewsArticleBySlugAsync(string slug)
        {
            try
            {
                ArticleTable foundArticle = await _db.ArticleTables.Where(t => t.ArticleSlug == slug).FirstOrDefaultAsync();
                if (foundArticle != null)
                {
                    ArticleWithContent returnArticle = new ArticleWithContent {
                        ArticleContent = foundArticle?.ArticleContent,
                        ArticleDate = (DateTime)foundArticle?.ArticleDatePosted,
                        ArticleDescription = foundArticle?.ArticleDescription,
                        ArticleSlug = foundArticle?.ArticleSlug,
                        ArticleTitle = foundArticle?.ArticleTitle,
                        ArticleType = foundArticle?.ArticleType,
                        ArticleImagePath = foundArticle?.ArticleImagePath
                    };

                    return new ObjectResult(returnArticle) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No Article found with given slug.") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get article by slug.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get article by slug.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetNewsOverviewAsync(int pageSize, int index)
        {
            try
            {
                List<ArticleTable> foundArticles = await _db.ArticleTables.OrderByDescending(t => t.ArticleDatePosted).Skip(index * pageSize).Take(pageSize).ToListAsync();
                if (foundArticles?.Count() > 0)
                {
                    List<Article> returnArticles = new List<Article>();

                    foreach (var article in foundArticles)
                    {
                        returnArticles.Add(new Article
                        {
                            ArticleDate = (DateTime)article?.ArticleDatePosted,
                            ArticleDescription = article?.ArticleDescription,
                            ArticleSlug = article?.ArticleSlug,
                            ArticleTitle = article?.ArticleTitle,
                            ArticleType = article?.ArticleType,
                            ArticleImagePath = article?.ArticleImagePath
                        });
                    }

                    return new ObjectResult(returnArticles) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No Articles found.") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get articles.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get articles.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }
    }
}

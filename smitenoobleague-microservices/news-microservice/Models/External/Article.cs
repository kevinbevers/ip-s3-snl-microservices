using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using news_microservice.Classes;

namespace news_microservice.Models.External
{
    public class Article
    {
        public string ArticleSlug { get; set; }
        [Required]
        [MaxLength(45)]
        [MinLength(8)]
        public string ArticleTitle { get; set; }
        [Required]
        public string ArticleDescription { get; set; }
        public DateTime ArticleDate { get; set; }
        [Required]
        public string ArticleType { get; set; }
        public string ArticleImagePath { get; set; }
        [MaxFileSize(29 * 1024 * 1024)]
        [AllowedExtensions(new[] { ".jpg", ".png", ".jpeg,", ".bmp" })]
        public IFormFile ArticleImageFile { get; set; }
    }
}

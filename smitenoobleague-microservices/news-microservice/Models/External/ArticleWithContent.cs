﻿using System;
using System.ComponentModel.DataAnnotations;

namespace news_microservice.Models.External
{
    public class ArticleWithContent : Article
    {
        [Required]
        [MinLength(50)]
        [MaxLength(1000)]
        public string ArticleContent { get; set; }
    }
}

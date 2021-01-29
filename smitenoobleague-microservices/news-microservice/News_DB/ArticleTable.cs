using System;
using System.Collections.Generic;

#nullable disable

namespace news_microservice.News_DB
{
    public partial class ArticleTable
    {
        public string ArticleSlug { get; set; }
        public string ArticleTitle { get; set; }
        public string ArticleDescription { get; set; }
        public string ArticleContent { get; set; }
    }
}

using System;
using System.Collections.Generic;

#nullable disable

namespace inhouse_microservice.Inhouse_DB
{
    public partial class TableItemDetail
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public string ItemIconUrl { get; set; }
    }
}

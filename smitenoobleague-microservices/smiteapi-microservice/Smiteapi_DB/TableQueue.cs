﻿using System;
using System.Collections.Generic;

#nullable disable

namespace smiteapi_microservice.Smiteapi_DB
{
    public partial class TableQueue
    {
        public int QueueId { get; set; }
        public int GameId { get; set; }
        public bool QueueState { get; set; }
        public DateTime QueueDate { get; set; }
    }
}

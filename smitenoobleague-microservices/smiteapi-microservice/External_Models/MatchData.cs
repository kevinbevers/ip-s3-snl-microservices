using System;
using System.Collections.Generic;

namespace smiteapi_microservice.External_Models
{
    public class MatchData
    {
        public int GameID { get; set; }
        public DateTime EntryDate { get; set; }
        public int MatchDurationInSeconds { get; set; } //use timespan to convert to actual time for representation
        public string MatchDuration { get; set; }
        public List<PlayerStat> Winners { get; set; }
        public List<PlayerStat> Losers { get; set; }
        public List<God> BannedGods { get; set; }
        public int GamemodeID { get; set; } //queue_id. 427 = custom conquest. 426 normal conquest
        //return message for possible errors. ex. match not available
        public object ret_msg { get; set; } 



        public class PlayerStat
        {
            //Team and matchstate
            public int IngameTeamID { get; set; } //taskforce
            public bool Won { get; set; }
            public bool FirstBanSide { get; set; }
            //Player info
            public Player player { get; set; }
            //God played
            public God God { get; set; }
            //Damage info
            public int DamageDealt { get; set; }
            public int DamageTaken { get; set; }
            public int DamageMitigated { get; set; }
            // K/D/A
            public int Kills { get; set; }
            public int Deaths { get; set; }
            public int Assists { get; set; }
            //General stat info
            public int Level { get; set; }
            public int GoldEarned { get; set; }
            public int GPM { get; set; }
            public int Healing { get; set; }         
            //Relics
            public int Relic1ID { get; set; }
            public int Relic2ID { get; set; }
            public string Relic1Icon { get; set; }
            public string Relic2Icon { get; set; }
            //Items
            public int Item1ID { get; set; }
            public int Item2ID { get; set; }
            public int Item3ID { get; set; }
            public int Item4ID { get; set; }
            public int Item5ID { get; set; }
            public int Item6ID { get; set; }
            public string Item1Icon { get; set; }
            public string Item2Icon { get; set; }
            public string Item3Icon { get; set; }
            public string Item4Icon { get; set; }
            public string Item5Icon { get; set; }
            public string Item6Icon { get; set; }
            //Map stats
            public int FireGiantsKilled { get; set; }
            public int GoldFuriesKilled { get; set; }
            //Extra stats
            public bool FirstBlood { get; set; }
            public int TowersDestroyed { get; set; }
            public int WardsPlaced { get; set; }
            public int StructureDamage { get; set; }
            public int MinionDamage { get; set; }
            public int DistanceTravelled { get; set; }
            public string Region { get; set; }




        }
    }
}

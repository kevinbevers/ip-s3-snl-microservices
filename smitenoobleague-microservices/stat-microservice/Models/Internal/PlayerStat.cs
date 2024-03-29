﻿using System;
namespace stat_microservice.Models.Internal
{
    public class PlayerStat
    {
        //Team and matchstate
        public int? IngameTeamID { get; set; } //taskforce
        public bool Won { get; set; }
        public bool FirstBanSide { get; set; }
        //is player a fill?
        public bool playerIsFill { get; set; }
        //Player info
        public Player Player { get; set; }
        //God played
        public God God { get; set; }
        //Damage info
        public int? DamageDealt { get; set; }
        public int? DamageTaken { get; set; }
        public int? DamageMitigated { get; set; }
        // K/D/A
        public int? Kills { get; set; }
        public int? Deaths { get; set; }
        public int? Assists { get; set; }
        //General stat info
        public int? Level { get; set; }
        public int? GoldEarned { get; set; }
        public int? GPM { get; set; }
        public int? Healing { get; set; }
        //Relics
        public int? Relic1ID { get; set; }
        public int? Relic2ID { get; set; }
        public string Relic1Icon { get; set; }
        public string Relic2Icon { get; set; }
        public string Relic1Name { get; set; }
        public string Relic2Name { get; set; }
        //Items
        public int? Item1ID { get; set; }
        public int? Item2ID { get; set; }
        public int? Item3ID { get; set; }
        public int? Item4ID { get; set; }
        public int? Item5ID { get; set; }
        public int? Item6ID { get; set; }
        public string Item1Icon { get; set; }
        public string Item2Icon { get; set; }
        public string Item3Icon { get; set; }
        public string Item4Icon { get; set; }
        public string Item5Icon { get; set; }
        public string Item6Icon { get; set; }
        public string Item1Name { get; set; }
        public string Item2Name { get; set; }
        public string Item3Name { get; set; }
        public string Item4Name { get; set; }
        public string Item5Name { get; set; }
        public string Item6Name { get; set; }
        //Map stats
        public int? FireGiantsKilled { get; set; }
        public int? GoldFuriesKilled { get; set; }
        //Extra stats
        public int? KillingSpree { get; set; }
        public bool FirstBlood { get; set; }
        public int? TowersDestroyed { get; set; }
        public int? PhoenixesDestroyed { get; set; }
        public int? WardsPlaced { get; set; }
        public int? StructureDamage { get; set; }
        public int? MinionDamage { get; set; }
        public int? DistanceTravelled { get; set; }
        public string Region { get; set; }
        public int? HighestMultiKill { get; set; }
        public int? ObjectiveAssists { get; set; }
        public int? TimeSpentDeathInSeconds { get; set; }
        public int? Pentas { get; set; }
        public int? Quadras { get; set; }
        public int? Triples { get; set; }
        public int? Doubles { get; set; }
    }
}

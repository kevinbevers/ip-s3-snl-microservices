using System;
using System.Collections.Generic;

namespace smiteapi_microservice.Internal_Models
{
    public partial class ApiGod
    {
        public string Ability1 { get; set; }
        public string Ability2 { get; set; }
        public string Ability3 { get; set; }
        public string Ability4 { get; set; }
        public string Ability5 { get; set; }
        public long AbilityId1 { get; set; }
        public long AbilityId2 { get; set; }
        public long AbilityId3 { get; set; }
        public long AbilityId4 { get; set; }
        public long AbilityId5 { get; set; }
        public Ability ApiGodAbility1 { get; set; }
        public Ability ApiGodAbility2 { get; set; }
        public Ability ApiGodAbility3 { get; set; }
        public Ability ApiGodAbility4 { get; set; }
        public Ability ApiGodAbility5 { get; set; }
        public double AttackSpeed { get; set; }
        public double AttackSpeedPerLevel { get; set; }
        public string Cons { get; set; }
        public double Hp5PerLevel { get; set; }
        public long Health { get; set; }
        public long HealthPerFive { get; set; }
        public long HealthPerLevel { get; set; }
        public string Lore { get; set; }
        public double Mp5PerLevel { get; set; }
        public long MagicProtection { get; set; }
        public double MagicProtectionPerLevel { get; set; }
        public long MagicalPower { get; set; }
        public double MagicalPowerPerLevel { get; set; }
        public long Mana { get; set; }
        public double ManaPerFive { get; set; }
        public long ManaPerLevel { get; set; }
        public string Name { get; set; }
        public string OnFreeRotation { get; set; }
        public string Pantheon { get; set; }
        public long PhysicalPower { get; set; }
        public double PhysicalPowerPerLevel { get; set; }
        public long PhysicalProtection { get; set; }
        public double PhysicalProtectionPerLevel { get; set; }
        public string Pros { get; set; }
        public Classes Classes { get; set; }
        public long Speed { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public AbilityDescription1 AbilityDescription1 { get; set; }
        public AbilityDescription1 AbilityDescription2 { get; set; }
        public AbilityDescription1 AbilityDescription3 { get; set; }
        public AbilityDescription1 AbilityDescription4 { get; set; }
        public AbilityDescription1 AbilityDescription5 { get; set; }
        public AbilityDescription1 BasicAttack { get; set; }
        public Uri GodAbility1_Url { get; set; }
        public Uri GodAbility2_Url { get; set; }
        public Uri GodAbility3_Url { get; set; }
        public Uri GodAbility4_Url { get; set; }
        public Uri GodAbility5_Url { get; set; }
        public Uri GodCard_Url { get; set; }
        public Uri GodIcon_URL { get; set; }
        public long Id { get; set; }
        public LatestGod LatestGod { get; set; }
        public object RetMsg { get; set; }
    }

    public partial class AbilityDescription1
    {
        public abilityDescription ItemDescription { get; set; }
    }

    public partial class abilityDescription
    {
        public string Cooldown { get; set; }
        public string Cost { get; set; }
        public string Description { get; set; }
        public List<Item> Menuitems { get; set; }
        public List<Item> Rankitems { get; set; }
    }

    public partial class Item
    {
        public string Description { get; set; }
        public string Value { get; set; }
    }

    public partial class Ability
    {
        public AbilityDescription1 Description { get; set; }
        public long Id { get; set; }
        public string Summary { get; set; }
        public Uri Url { get; set; }
    }

    public enum LatestGod { N, Y };

    public enum Classes { Assassin, Guardian, Hunter, Mage, Warrior };

    //public enum TypeEnum { Magical, MeleeMagical, MeleePhysical, Ranged, RangedMagical, RangedPhysical };

}

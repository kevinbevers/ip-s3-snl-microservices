using System;
namespace stat_microservice.Models.Internal
{
    public class PlayerStatWithRole : PlayerStat //Playerstat + Role for the match history
    {
        public Role Role { get; set; }
    }
}

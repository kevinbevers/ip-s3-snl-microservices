﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using team_microservice.Interfaces;
using team_microservice.Models.External;
using team_microservice.Team_DB;
using Microsoft.EntityFrameworkCore;
using team_microservice.Models.Internal;

namespace team_microservice.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly SNL_Team_DBContext _db;
        private readonly ILogger<PlayerService> _logger;

        public PlayerService(SNL_Team_DBContext db, ILogger<PlayerService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ActionResult<IEnumerable<PlayerWithTeamInfo>>> GetPlayersByDivisionIdAsync(int? divisionID)
        {
            try
            {
                List<TableTeamMember> foundPlayers = await _db.TableTeamMembers.Where(tm => tm.TeamMemberDivisionId == divisionID).ToListAsync();
                if (foundPlayers?.Count() == 0)
                {
                    return new ObjectResult("No players found with the given division ID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    List<PlayerWithTeamInfo> returnPlayers = new List<PlayerWithTeamInfo>();

                    foreach (var p in foundPlayers)
                    {
                        TableRole PlayerRole = await _db.TableRoles.Where(r => r.RoleId == p.TeamMemberRole).FirstOrDefaultAsync();
                        //could first pull all teams that are in the list and use them in here. but this will also do the job.
                        TableTeam team = await _db.TableTeams.Where(t => t.TeamId == p.TeamMemberTeamId).FirstOrDefaultAsync();

                        returnPlayers.Add(new PlayerWithTeamInfo
                        {
                            Team = new Team
                            {
                                TeamID = team.TeamId,
                                TeamName = team.TeamName,
                                DivisionID = team.TeamDivisionId,
                                TeamLogoPath = team.TeamLogoPath
                            },
                            Player = new TeamMember
                            {
                                TeamMemberID = p.TeamMemberId,
                                TeamCaptain = team.TeamCaptainId == p.TeamMemberId,
                                TeamMemberName = p.TeamMemberName,
                                TeamMemberPlatform = ((ApiPlatformEnum)p.TeamMemberPlatformId).ToString(),
                                TeamMemberRole = new Role { RoleID = PlayerRole.RoleId, RoleName = PlayerRole.RoleName },
                                PlayerID = p.TeamMemberPlayerId
                            }
                        });
                    }

                    return new ObjectResult(returnPlayers) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get players with division ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get players with division ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<PlayerWithTeamInfo>> GetPlayerWithTeamInfoByPlayerID(int? playerID)
        {
            try
            {
                TableTeamMember foundPlayer = await _db.TableTeamMembers.Where(tm => tm.TeamMemberPlayerId == playerID).FirstOrDefaultAsync();
                if (foundPlayer == null)
                {
                    return new ObjectResult("No players found with the given player ID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    TableRole PlayerRole = await _db.TableRoles.Where(r => r.RoleId == foundPlayer.TeamMemberRole).FirstOrDefaultAsync();
                    //could first pull all teams that are in the list and use them in here. but this will also do the job.
                    TableTeam team = await _db.TableTeams.Where(t => t.TeamId == foundPlayer.TeamMemberTeamId).FirstOrDefaultAsync();

                    PlayerWithTeamInfo returnPlayer = new PlayerWithTeamInfo
                    {
                        Team = new Team
                        {
                            TeamID = team.TeamId,
                            TeamName = team.TeamName,
                            DivisionID = team.TeamDivisionId,
                            TeamLogoPath = team.TeamLogoPath
                        },
                        Player = new TeamMember
                        {
                            TeamMemberID = foundPlayer.TeamMemberId,
                            TeamCaptain = team.TeamCaptainId == foundPlayer.TeamMemberId,
                            TeamMemberName = foundPlayer.TeamMemberName,
                            TeamMemberPlatform = ((ApiPlatformEnum)foundPlayer.TeamMemberPlatformId).ToString(),
                            TeamMemberRole = new Role { RoleID = PlayerRole.RoleId, RoleName = PlayerRole.RoleName },
                            PlayerID = foundPlayer.TeamMemberPlayerId
                        }
                    };

                    return new ObjectResult(returnPlayer) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get player with player ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get player with player ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<List<Role>>> GetAllRolesAsync()
        {
            try
            {
                List<TableRole> foundRoles = await _db.TableRoles.ToListAsync();
                if (foundRoles?.Count() > 0)
                {
                    List<Role> roles = new List<Role>();

                    foreach(var role in foundRoles)
                    {
                        roles.Add(new Role { RoleID = role.RoleId, RoleName = role.RoleName });
                    }

                    return new ObjectResult(roles) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No roles found") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get roles.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get roles.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }
    }
}

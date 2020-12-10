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
    public class TeamService : ITeamService
    {
        private readonly SNL_Team_DBContext _db;
        private readonly ILogger<TeamService> _logger;
        private readonly IValidationService _validationService;

        public TeamService(SNL_Team_DBContext db, ILogger<TeamService> logger, IValidationService validationService)
        {
            _db = db;
            _logger = logger;
            _validationService = validationService;
        }

        public async Task<ActionResult<Team>> AddTeamAsync(TeamSubmission teamSubmisssion)
        {
            try
            {
                if (await _validationService.CheckIfDivisionIsFull((int)teamSubmisssion.TeamDivisionID))
                {
                    return new ObjectResult("Couldn't add team, division is already at the cap of 8 teams.") { StatusCode = 400 };
                }
                else
                {
                    if (await _validationService.CheckIfTeamNameIsTaken(teamSubmisssion.TeamName, null))
                    {
                        return new ObjectResult("Couldn't add team, given name is already taken.") { StatusCode = 400 };
                    }
                    else
                    {
                        if (teamSubmisssion.Captain.TeamCaptainPlayerID != null)
                        {
                            if (await _validationService.CheckIfCaptainIsTaken((int)teamSubmisssion.Captain.TeamCaptainPlayerID, null))
                            {
                                return new ObjectResult("Teamcaptain already taken.") { StatusCode = 400 }; //BAD REQUEST
                            }

                            TableTeamMember addCaptain = new TableTeamMember
                            {
                                TeamMemberPlayerId = (int)teamSubmisssion.Captain.TeamCaptainPlayerID,
                                TeamMemberName = teamSubmisssion.Captain.TeamCaptainPlayerName,
                                TeamMemberAccountId = teamSubmisssion.Captain.TeamCaptainAccountID,
                                TeamMemberPlatformId = teamSubmisssion.Captain.TeamCaptainPlatformID,
                                TeamMemberDivisionId = (int)teamSubmisssion.TeamDivisionID,
                                TeamMemberRole = 1 //default sololaner they can change it themselves
                            };

                            _db.TableTeamMembers.Add(addCaptain);
                            await _db.SaveChangesAsync();

                            TableTeam addTeam = new TableTeam
                            {
                                TeamName = teamSubmisssion.TeamName,
                                TeamDivisionId = teamSubmisssion.TeamDivisionID,
                                TeamCaptainId = addCaptain.TeamMemberId,
                            };

                            _db.TableTeams.Add(addTeam);
                            await _db.SaveChangesAsync();

                            //update captain teamID with the generated ID
                            addCaptain.TeamMemberTeamId = addTeam.TeamId;
                            _db.TableTeamMembers.Update(addCaptain);
                            _db.SaveChanges();

                            return new ObjectResult("Team added succesfully, with captain.") { StatusCode = 201 };
                        }
                        else
                        {
                            TableTeam addTeam = new TableTeam
                            {
                                TeamName = teamSubmisssion.TeamName,
                                TeamDivisionId = teamSubmisssion.TeamDivisionID,
                                TeamCaptainId = null
                            };

                            _db.TableTeams.Add(addTeam);
                            await _db.SaveChangesAsync();

                            return new ObjectResult("Team added succesfully, without captain.") { StatusCode = 201 };
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to add a team.");
                //return result to client
                return new ObjectResult("Something went wrong trying to add a team.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> AddTeamMemberToTeamAsync(TeamMemberSubmission teamMemberSubmission)
        {
            try
            {
                if (await _db.TableTeams.Where(t => t.TeamId == teamMemberSubmission.TeamID).CountAsync() > 0)
                {
                    if (await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == teamMemberSubmission.TeamID).CountAsync() > 4)
                    {
                        return new ObjectResult("Couldn't add team-member, team is already at the cap of 5 players.") { StatusCode = 400 };
                    }
                    else
                    {
                        if (await _validationService.CheckIfTeamMemberIsTaken(teamMemberSubmission.PlayerID, teamMemberSubmission.TeamID))
                        {
                            return new ObjectResult("Couldn't add team-member, given player is already taken.") { StatusCode = 400 };
                        }
                        else
                        {
                            if (await _db.TableTeamMembers.Where(m => m.TeamMemberPlayerId == teamMemberSubmission.PlayerID && m.TeamMemberTeamId == teamMemberSubmission.TeamID).CountAsync() > 0)
                            {
                                return new ObjectResult("Couldn't add team-member, given player is already in your team.") { StatusCode = 400 };
                            }
                            else
                            {
                                if (await _db.TableRoles.Where(r => r.RoleId == teamMemberSubmission.RoleID).CountAsync() > 0)
                                {
                                    if (await _db.TableTeamMembers.Where(m => m.TeamMemberRole == teamMemberSubmission.RoleID).CountAsync() > 0)
                                    {
                                        return new ObjectResult("Given Role is already taken.") { StatusCode = 400 };
                                    }
                                    else
                                    {
                                        TableTeamMember teamMember = new TableTeamMember
                                        {
                                            TeamMemberTeamId = teamMemberSubmission.TeamID,
                                            TeamMemberDivisionId = (int)await _db.TableTeams.Where(t => t.TeamId == teamMemberSubmission.TeamID).Select(t => t.TeamDivisionId).FirstOrDefaultAsync(),
                                            TeamMemberName = teamMemberSubmission.PlayerName,
                                            TeamMemberPlayerId = teamMemberSubmission.PlayerID,
                                            TeamMemberPlatformId = teamMemberSubmission.PlatformID,
                                            TeamMemberRole = teamMemberSubmission.RoleID, //1 solo, 2 jungle, 3 mid, 4 support, 5 adc
                                        };

                                        _db.TableTeamMembers.Add(teamMember);
                                        await _db.SaveChangesAsync();


                                        return new ObjectResult("Team-member succesfully added to team") { StatusCode = 201 };
                                    }
                                }
                                else
                                {
                                    return new ObjectResult("Given RoleID is invalid.") { StatusCode = 400 };
                                }
                            }
                        }
                    }
                }
                else
                {
                    return new ObjectResult("No team found with the given ID.") { StatusCode = 400 };
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to add a team-member.");
                //return result to client
                return new ObjectResult("Something went wrong trying to add a team-member.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> DeleteTeamAsync(int teamID)
        {
            try
            {
                TableTeam foundTeam = await _db.TableTeams.Where(t => t.TeamId == teamID).FirstOrDefaultAsync();
                if(foundTeam != null)
                {
                    _db.TableTeams.Remove(foundTeam);
                    List<TableTeamMember> foundTeamMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == teamID).ToListAsync();
                    _db.TableTeamMembers.RemoveRange(foundTeamMembers);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Team deleted successfully.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No team found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a team.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a team.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> DeleteTeamMemberFromTeamSync(int teamMemberID)
        {
            try
            {
                TableTeamMember foundTeamMember = await _db.TableTeamMembers.Where(m => m.TeamMemberId == teamMemberID).FirstOrDefaultAsync();
                if (foundTeamMember != null)
                {
                    _db.TableTeamMembers.Remove(foundTeamMember);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Team-member removed successfully.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No Team-member found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a team-member.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a team-member.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> DeleteTeamsByDivisionIdAsync(int divisionID)
        {
            try
            {
                List<TableTeam> foundTeams = await _db.TableTeams.Where(t => t.TeamDivisionId == divisionID).ToListAsync();
                if (foundTeams.Count() > 0)
                {
                    List<TableTeamMember> foundMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberDivisionId == divisionID).ToListAsync();

                    _db.TableTeamMembers.RemoveRange(foundMembers);
                    _db.TableTeams.RemoveRange(foundTeams);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("All teams removed from division successfully.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No teams found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete all teams from a division.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete all teams from a division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsByDivisionIdAsync(int divisionID)
        {
            try
            {
                List<TableTeam> foundTeams = await _db.TableTeams.Where(t => t.TeamDivisionId == divisionID).ToListAsync();
                if (foundTeams.Count() == 0)
                {
                    return new ObjectResult("No teams found with the given division ID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    List<Team> returnTeams = new List<Team>();

                    foreach (var team in foundTeams)
                    {                   
                        returnTeams.Add(new TeamWithDetails
                        {
                            TeamID = team.TeamId,
                            TeamName = team.TeamName,
                            DivisionID = (int)team.TeamDivisionId
                        });
                    }

                    return new ObjectResult(returnTeams) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get teams with division ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get teams with division ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamsByDivisionIdWithDetailsAsync(int divisionID)
        {
            try
            {
                List<TableTeam> foundTeams = await _db.TableTeams.Where(t => t.TeamDivisionId == divisionID).ToListAsync();
                if (foundTeams.Count() == 0)
                {
                    return new ObjectResult("No teams found with the given division ID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    List<TeamWithDetails> returnTeams = new List<TeamWithDetails>();

                   foreach(var team in foundTeams)
                    {
                       List<TableTeamMember> teamMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == team.TeamId).ToListAsync();

                        List<TeamMember> members = new List<TeamMember>();

                        foreach (var m in teamMembers)
                        {
                            var PlayerRole = await _db.TableRoles.Where(r => r.RoleId == m.TeamMemberRole).FirstOrDefaultAsync();

                            members.Add(new TeamMember
                            {
                                TeamMemberID = m.TeamMemberId,
                                TeamCaptain = team.TeamCaptainId == m.TeamMemberId ? true : false,
                                TeamMemberName = m.TeamMemberName,
                                TeamMemberPlatform = ((ApiPlatformEnum)m.TeamMemberPlatformId).ToString(),
                                TeamMemberRole = new Role { RoleID = PlayerRole.RoleId, RoleName = PlayerRole.RoleName },
                                PlayerID = m.TeamMemberPlayerId
                            });
                        }

                        returnTeams.Add(new TeamWithDetails
                        {
                            TeamID = team.TeamId,
                            TeamName = team.TeamName,
                            DivisionID = (int)team.TeamDivisionId,
                            TeamMembers = members
                        });
                    }

                    return new ObjectResult(returnTeams) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get teams with division ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get teams with division ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<TeamWithDetails>> GetTeamWithDetailsByTeamIdAsync(int teamID)
        {
            try
            {
                TableTeam foundTeam = await _db.TableTeams.Where(t => t.TeamId == teamID).FirstOrDefaultAsync();
                if (foundTeam == null)
                {
                    return new ObjectResult("No team found with the given ID") { StatusCode = 404 }; //OK
                }
                else
                {
                    List<TableTeamMember> teamMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == teamID).ToListAsync();

                    List<TeamMember> members = new List<TeamMember>();

                    foreach (var m in teamMembers)
                    {
                        var PlayerRole = await _db.TableRoles.Where(r => r.RoleId == m.TeamMemberRole).FirstOrDefaultAsync();

                        members.Add(new TeamMember
                        {
                            TeamMemberID = m.TeamMemberId,
                            TeamCaptain = foundTeam.TeamCaptainId == m.TeamMemberId ? true : false,
                            TeamMemberName = m.TeamMemberName,
                            TeamMemberPlatform = ((ApiPlatformEnum)m.TeamMemberPlatformId).ToString(),
                            TeamMemberRole = new Role { RoleID = PlayerRole.RoleId, RoleName = PlayerRole.RoleName },
                            PlayerID = m.TeamMemberPlayerId
                        });
                    }

                    TeamWithDetails returnTeam = new TeamWithDetails
                    {
                        TeamID = foundTeam.TeamId,
                        TeamName = foundTeam.TeamName,
                        TeamMembers = members
                    };

                    return new ObjectResult(returnTeam) { StatusCode = 200 }; //OK
                }         
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get team with ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get team with ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateTeamAsync(TeamSubmission ts)
        {
            try
            {
                TableTeam foundTeam = await _db.TableTeams.Where(t => t.TeamId == ts.TeamID).FirstOrDefaultAsync();
                if (foundTeam != null)
                {
                    if (await _validationService.CheckIfTeamNameIsTaken(ts.TeamName, foundTeam.TeamId))
                    {
                        return new ObjectResult("Teamname is already taken.") { StatusCode = 400 }; //BAD REQUEST
                    }
                    else
                    {
                        List<TableTeamMember> foundMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == ts.TeamID).ToListAsync();

                        if (ts.Captain?.TeamCaptainPlayerID != null)
                        {
                            if (await _validationService.CheckIfCaptainIsTaken((int)ts.Captain?.TeamCaptainPlayerID, foundTeam.TeamId))
                            {
                                return new ObjectResult("Teamcaptain already taken.") { StatusCode = 400 }; //BAD REQUEST
                            }
                            else
                            {
                                if(ts.Captain.TeamCaptainPlatformID == null || ts.Captain.TeamCaptainPlayerName == null)
                                {
                                    return new ObjectResult("Not all info provided for Teamcaptain.") { StatusCode = 400 }; //OK
                                }

                                TableTeamMember TeamCaptain = foundMembers.Where(m => m.TeamMemberPlayerId == ts.Captain.TeamCaptainPlayerID).FirstOrDefault();
                                //if captain isn't in the current team
                                if(TeamCaptain == null)
                                {
                                    TableTeamMember tc = new TableTeamMember
                                    {
                                        TeamMemberPlayerId = (int)ts.Captain.TeamCaptainPlayerID,
                                        TeamMemberAccountId = ts.Captain.TeamCaptainAccountID,
                                        TeamMemberDivisionId = (int)foundTeam.TeamDivisionId,
                                        TeamMemberName = ts.Captain.TeamCaptainPlayerName,
                                        TeamMemberRole = ts.Captain.TeamCaptainRoleID,
                                        TeamMemberPlatformId = ts.Captain.TeamCaptainPlatformID,
                                        TeamMemberTeamId = foundTeam.TeamId
                                    };

                                    _db.TableTeamMembers.Remove(await _db.TableTeamMembers.Where(m => m.TeamMemberId == foundTeam.TeamCaptainId).FirstOrDefaultAsync());
                                    _db.TableTeamMembers.Add(tc);
                                    await _db.SaveChangesAsync();

                                    TableTeam tableTeam = new TableTeam
                                    {
                                        TeamId = foundTeam.TeamId,
                                        TeamDivisionId = ts.TeamDivisionID != null ? ts.TeamDivisionID : foundTeam.TeamDivisionId,
                                        TeamCaptainId = tc.TeamMemberId,
                                        TeamName = ts.TeamName
                                    };

                                    _db.TableTeams.Update(tableTeam);

                                    return new ObjectResult("Team updated successfully.") { StatusCode = 200 }; //OK
                                }
                                else
                                {
                                    TableTeam tableTeam = new TableTeam
                                    {
                                        TeamId = foundTeam.TeamId,
                                        TeamDivisionId = ts.TeamDivisionID != null ? ts.TeamDivisionID : foundTeam.TeamDivisionId,
                                        TeamCaptainId = TeamCaptain.TeamMemberId,
                                        TeamName = ts.TeamName
                                    };

                                    return new ObjectResult("Team updated successfully.") { StatusCode = 200 }; //OK
                                }                              
                            }
                        }
                        else
                        {
                            foundTeam.TeamDivisionId = ts.TeamDivisionID != null ? ts.TeamDivisionID : foundTeam.TeamDivisionId;
                            foundTeam.TeamCaptainId = foundTeam.TeamCaptainId;
                            foundTeam.TeamName = ts.TeamName;

                            _db.TableTeams.Update(foundTeam);
                            await _db.SaveChangesAsync();

                            return new ObjectResult("Team updated successfully.") { StatusCode = 200 }; //OK
                        } 
                    }
                }
                else
                {
                    return new ObjectResult("No teams found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update a team.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update a team.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateTeamMemberRole(UpdateRole update)
        {
            //swap roles around 
            try
            {
                TableTeamMember teamMemberToUpdate = await _db.TableTeamMembers.Where(m => m.TeamMemberId == update.TeamMemberID).FirstOrDefaultAsync();
                if(teamMemberToUpdate == null)
                {
                    return new ObjectResult("couldn't find team-member with the given ID") { StatusCode = 400 }; //BAD REQUEST
                }
                else
                {
                    if(teamMemberToUpdate.TeamMemberRole == update.RoleID)
                    {
                        return new ObjectResult("Team-member new role is the same as the old role") { StatusCode = 400 }; //BAD REQUEST
                    }
                    else
                    {
                        int teamID = teamMemberToUpdate.TeamMemberTeamId;
                        TableTeamMember teamMemberToSwapWith = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == teamID && m.TeamMemberRole == update.RoleID).FirstOrDefaultAsync();

                        if (teamMemberToSwapWith != null)
                        {
                            int swapRole = (int)teamMemberToUpdate.TeamMemberRole;

                            teamMemberToSwapWith.TeamMemberRole = swapRole;
                            teamMemberToUpdate.TeamMemberRole = update.RoleID;

                            _db.TableTeamMembers.Update(teamMemberToSwapWith);
                            _db.TableTeamMembers.Update(teamMemberToUpdate);
                            await _db.SaveChangesAsync();
                        }
                        else
                        {
                            teamMemberToUpdate.TeamMemberRole = update.RoleID;
                            _db.TableTeamMembers.Update(teamMemberToUpdate);
                            await _db.SaveChangesAsync();
                        }

                        return new ObjectResult("Team-member role updated") { StatusCode = 200 }; //OK
                    } 
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update team-member role.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update team-member role.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateTeamMemberToTeamAsync(TeamMemberSubmission ts)
        {
            try
            {
                TableTeam foundTeam = await _db.TableTeams.Where(t => t.TeamId == ts.TeamID).FirstOrDefaultAsync();
                if (foundTeam != null)
                {
                    TableTeamMember foundTeamMember = await _db.TableTeamMembers.Where(m => m.TeamMemberId == ts.TeamMemberID).FirstOrDefaultAsync();

                    if(foundTeamMember == null)
                    {
                        return new ObjectResult("No team-member found with the given ID") { StatusCode = 400 }; //OK
                    }
                    else
                    {
                        if (foundTeamMember.TeamMemberRole == ts.RoleID)
                        {
                            foundTeamMember.TeamMemberRole = ts.RoleID;
                            foundTeamMember.TeamMemberPlayerId = ts.PlayerID;
                            foundTeamMember.TeamMemberPlatformId = ts.PlatformID;
                            foundTeamMember.TeamMemberName = ts.PlayerName;

                            _db.TableTeamMembers.Update(foundTeamMember);
                            await _db.SaveChangesAsync();

                            return new ObjectResult("Team-member updated successfully.") { StatusCode = 200 }; //OK
                        }
                        else
                        {
                            foundTeamMember.TeamMemberPlayerId = ts.PlayerID;
                            foundTeamMember.TeamMemberPlatformId = ts.PlatformID;
                            foundTeamMember.TeamMemberName = ts.PlayerName;

                            List<TableTeamMember> swap = await SwapRoles(foundTeamMember, ts.RoleID);

                            _db.UpdateRange(swap);
                            await _db.SaveChangesAsync();

                            return new ObjectResult("Team-member updated successfully.") { StatusCode = 200 }; //OK
                        }

                    }
                }
                else
                {
                    return new ObjectResult("No team found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update a team-member.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update a team-member.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }


        #region private methods
        private async Task<List<TableTeamMember>> SwapRoles(TableTeamMember foundTeamMember, int RoleID)
        {
            TableTeamMember teamMemberToSwapWith = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == foundTeamMember.TeamMemberTeamId && m.TeamMemberRole == RoleID).FirstOrDefaultAsync();

            int swapRole = (int)foundTeamMember.TeamMemberRole;

            teamMemberToSwapWith.TeamMemberRole = swapRole;
            foundTeamMember.TeamMemberRole = RoleID;

            List<TableTeamMember> swap = new List<TableTeamMember>();
            swap.Add(teamMemberToSwapWith);
            swap.Add(foundTeamMember);

            return swap;
        }
        #endregion
    }
}

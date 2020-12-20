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
        private readonly IExternalServices _externalServices;

        public TeamService(SNL_Team_DBContext db, ILogger<TeamService> logger, IValidationService validationService, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _validationService = validationService;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<Team>> AddTeamAsync(TeamSubmissionAdmin teamSubmisssion)
        {
            try
            {
                if (teamSubmisssion.TeamDivisionID != null)
                {
                    IList<Division> divisions = await _externalServices.GetAllAvailableDivisions();
                    if (divisions != null)
                    {
                        if (divisions.Where(d => d.DivisionID == teamSubmisssion.TeamDivisionID).Count() > 0)
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
                                    if (teamSubmisssion.Captain?.TeamCaptainPlayerID != null)
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
                                            TeamMemberRole = teamSubmisssion?.Captain?.TeamCaptainRoleID != null ? teamSubmisssion.Captain.TeamCaptainRoleID : 1
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
                        else
                        {
                            return new ObjectResult("Cant add a team to a non existent division") { StatusCode = 400 };
                            
                        }
                    }
                    else
                    {
                        return new ObjectResult("No divisions created yet. Add a division or remove divisionID from the request.") { StatusCode = 400 };
                    }
                }
                else
                {
                    if (teamSubmisssion.Captain?.TeamCaptainPlayerID != null)
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
                            TeamMemberRole = teamSubmisssion?.Captain?.TeamCaptainRoleID != null ? teamSubmisssion.Captain.TeamCaptainRoleID : 1
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

                        return new ObjectResult("Team added succesfully, with captain, and no division.") { StatusCode = 201 };
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

                        return new ObjectResult("Team added succesfully, without captain and division.") { StatusCode = 201 };
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
                        if (await _validationService.CheckIfTeamMemberIsTaken((int)teamMemberSubmission.PlayerID, teamMemberSubmission.TeamID))
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
                                    if (await _db.TableTeamMembers.Where(m => m.TeamMemberRole == teamMemberSubmission.RoleID && m.TeamMemberTeamId == teamMemberSubmission.TeamID).CountAsync() > 0)
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
                                            TeamMemberPlayerId = (int)teamMemberSubmission.PlayerID,
                                            TeamMemberPlatformId = (int)(ApiPlatformEnum)Enum.Parse(typeof(ApiPlatformEnum), teamMemberSubmission.PlatformName),
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
                if (foundTeam != null)
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

        public async Task<ActionResult<Team>> GetAllTeamsAsync()
        {
            try
            {
                List<TableTeam> foundTeams = await _db.TableTeams.ToListAsync();
                if (foundTeams.Count() == 0)
                {
                    return new ObjectResult("No teams created yet.") { StatusCode = 404 }; //NOT FOUND
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
                            DivisionID = (int)team.TeamDivisionId,
                            TeamLogoPath = team.TeamLogoPath
                        });
                    }

                    return new ObjectResult(returnTeams) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get teams all teams");
                //return result to client
                return new ObjectResult("Something went wrong trying to get teams all teams.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
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
                            DivisionID = (int)team.TeamDivisionId,
                            TeamLogoPath = team.TeamLogoPath
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

                    foreach (var team in foundTeams)
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
                            TeamMembers = members,
                            TeamLogoPath = team.TeamLogoPath
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

        public async Task<ActionResult<TeamWithDetails>> GetTeamWithDetailsByCaptainAccountIdAsync(string captainID)
        {
            try
            {
                TableTeamMember captain = await _db.TableTeamMembers.Where(m => m.TeamMemberAccountId == captainID).FirstOrDefaultAsync();

                if (captain != null)
                {
                    TableTeam foundTeam = await _db.TableTeams.Where(t => t.TeamCaptainId == captain.TeamMemberId).FirstOrDefaultAsync();
                    if (foundTeam == null)
                    {
                        return new ObjectResult("No team found with the given ID") { StatusCode = 404 }; //NOT FOUND
                    }
                    else
                    {
                        List<TableTeamMember> teamMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == foundTeam.TeamId).OrderBy(m => m.TeamMemberRole).ToListAsync();

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
                            TeamMembers = members,
                            DivisionID = (int)foundTeam.TeamDivisionId,
                            TeamLogoPath = foundTeam.TeamLogoPath

                        };

                        return new ObjectResult(returnTeam) { StatusCode = 200 }; //OK
                    }
                }
                else
                {
                    return new ObjectResult("No captain found with the given Account ID") { StatusCode = 404 }; //NOT FOUND
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
                    List<TableTeamMember> teamMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberTeamId == teamID).OrderBy(m => m.TeamMemberRole).ToListAsync();

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
                        TeamMembers = members,
                        TeamLogoPath = foundTeam.TeamLogoPath
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

        public async Task<ActionResult> SetDivisionTeams(SetDivisionTeams divisionTeams)
        {
            try
            {
                if (divisionTeams.teamIdList.Count() > 0)
                {
                    List<TableTeam> teamsToRemove = await _db.TableTeams.Where(t => t.TeamDivisionId == divisionTeams.divisionID).ToListAsync();
                    if (teamsToRemove.Count() > 0)
                    {
                        //Remove current teams and members from the given division
                        List<TableTeamMember> foundMembers = await _db.TableTeamMembers.Where(m => m.TeamMemberDivisionId == divisionTeams.divisionID).ToListAsync();
                        foundMembers.ForEach(m => m.TeamMemberDivisionId = null);
                        teamsToRemove.ForEach(t => t.TeamDivisionId = null);

                        _db.TableTeamMembers.UpdateRange(foundMembers);
                        _db.TableTeams.UpdateRange(teamsToRemove);

                        await _db.SaveChangesAsync();
                    }

                    List<TableTeam> teamsToAdd = await _db.TableTeams.Where(t => divisionTeams.teamIdList.Contains(t.TeamId)).ToListAsync();
                    if (teamsToAdd.Count() > 0)
                    {
                        //update teams and members with the given division
                        teamsToAdd.ForEach(t => t.TeamDivisionId = divisionTeams.divisionID);

                        List<TableTeamMember> membersToAdd = await _db.TableTeamMembers.Where(m => divisionTeams.teamIdList.Contains(m.TeamMemberTeamId)).ToListAsync();
                        membersToAdd.ForEach(m => m.TeamMemberDivisionId = divisionTeams.divisionID);

                        _db.TableTeams.UpdateRange(teamsToAdd);
                        _db.TableTeamMembers.UpdateRange(membersToAdd);

                        await _db.SaveChangesAsync();

                        return new ObjectResult("Division teams updated") { StatusCode = 200 }; //OK
                    }
                    else
                    {
                        return new ObjectResult("No teams found with the given IDs.") { StatusCode = 404 }; //NOT FOUND  
                    }
                }
                else
                {
                    return new ObjectResult("No teamID's submitted") { StatusCode = 400 }; //NOT FOUND  
                }



            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to set division for teams.");
                //return result to client
                return new ObjectResult("Something went wrong trying to set division for teams.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateTeamAsAdminAsync(TeamSubmissionAdmin ts)
        {
            try
            {
                if (ts.TeamDivisionID != null)
                {
                    IList<Division> divisions = await _externalServices.GetAllAvailableDivisions();
                    if (divisions != null)
                    {
                        if (divisions.Where(d => d.DivisionID == ts.TeamDivisionID).Count() > 0)
                        {
                            if (await _validationService.CheckIfDivisionIsFull((int)ts.TeamDivisionID))
                            {
                                return new ObjectResult("Couldn't add team, division is already at the cap of 8 teams.") { StatusCode = 400 };
                            }
                            else
                            {
                                return await UpdateTeam(ts);
                            }
                        }
                        else
                        {
                            return new ObjectResult("No divisions created yet. Add a division or remove divisionID from the request.") { StatusCode = 400 };
                        }
                    }
                    else
                    {
                        return new ObjectResult("No divisions created yet. Add a division or remove divisionID from the request.") { StatusCode = 400 };
                    }
                }
                else
                {
                    return await UpdateTeam(ts);
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

        public async Task<ActionResult> UpdateTeamAsCaptainSync(TeamSubmission ts)
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
                        //update teamname
                        if (ts.TeamName != null)
                        {
                            foundTeam.TeamName = ts.TeamName;
                        }

                        //update team logo
                        if (ts.TeamLogo != null)
                        {

                        }

                        _db.TableTeams.Update(foundTeam);
                        await _db.SaveChangesAsync();

                        return new ObjectResult("Team updated successfully.") { StatusCode = 200 }; //OK

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
                if (teamMemberToUpdate == null)
                {
                    return new ObjectResult("couldn't find team-member with the given ID") { StatusCode = 400 }; //BAD REQUEST
                }
                else
                {
                    if (teamMemberToUpdate.TeamMemberRole == update.RoleID)
                    {
                        return new ObjectResult("Team-member new role is the same as the old role") { StatusCode = 400 }; //BAD REQUEST
                    }
                    else
                    {
                        List<TableTeamMember> swap = await SwapRoles(teamMemberToUpdate, update.RoleID);

                        if (swap.Count() > 1)
                        {
                            _db.UpdateRange(swap);
                            await _db.SaveChangesAsync();
                            return new ObjectResult("Team-member roles swapped") { StatusCode = 200 }; //OK
                        }
                        else
                        {
                            _db.UpdateRange(swap);
                            await _db.SaveChangesAsync();
                            return new ObjectResult("Team-member role updated") { StatusCode = 200 }; //OK
                        }


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

                    if (foundTeamMember == null)
                    {
                        return new ObjectResult("No team-member found with the given ID") { StatusCode = 400 }; //OK
                    }
                    else
                    {
                        if (ts.PlayerID == 0 || ts.PlayerName == null || ts.PlatformName == null)
                        {
                            return new ObjectResult("Player data was incomplete or empty") { StatusCode = 400 }; //OK
                        }
                        else
                        {
                            if (ts.RoleID != null)
                            {
                                if (await _db.TableRoles.Where(r => r.RoleId == ts.RoleID).CountAsync() > 0)
                                {
                                    if (foundTeamMember.TeamMemberRole == ts.RoleID)
                                    {
                                        foundTeamMember.TeamMemberRole = ts.RoleID;
                                        foundTeamMember.TeamMemberPlayerId = (int)ts.PlayerID;
                                        foundTeamMember.TeamMemberPlatformId = (int)(ApiPlatformEnum)Enum.Parse(typeof(ApiPlatformEnum), ts.PlatformName);
                                        foundTeamMember.TeamMemberName = ts.PlayerName;

                                        _db.TableTeamMembers.Update(foundTeamMember);
                                        await _db.SaveChangesAsync();

                                        return new ObjectResult("Team-member updated successfully.") { StatusCode = 200 }; //OK
                                    }
                                    else
                                    {
                                        foundTeamMember.TeamMemberPlayerId = (int)ts.PlayerID;
                                        foundTeamMember.TeamMemberPlatformId = (int)(ApiPlatformEnum)Enum.Parse(typeof(ApiPlatformEnum), ts.PlatformName);
                                        foundTeamMember.TeamMemberName = ts.PlayerName;

                                        List<TableTeamMember> swap = await SwapRoles(foundTeamMember, (int)ts.RoleID);

                                        _db.UpdateRange(swap);
                                        await _db.SaveChangesAsync();

                                        return new ObjectResult("Team-member updated successfully.") { StatusCode = 200 }; //OK
                                    }
                                }
                                else
                                {
                                    return new ObjectResult("Given RoleID was invalid") { StatusCode = 400 }; //OK
                                }
                            }
                            else
                            {
                                foundTeamMember.TeamMemberPlayerId = (int)ts.PlayerID;
                                foundTeamMember.TeamMemberPlatformId = (int)(ApiPlatformEnum)Enum.Parse(typeof(ApiPlatformEnum), ts.PlatformName);
                                foundTeamMember.TeamMemberName = ts.PlayerName;

                                _db.TableTeamMembers.Update(foundTeamMember);
                                await _db.SaveChangesAsync();

                                return new ObjectResult("Team-member updated successfully.") { StatusCode = 200 }; //OK
                            }
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

            if (teamMemberToSwapWith != null)
            {
                int swapRole = (int)foundTeamMember.TeamMemberRole;

                teamMemberToSwapWith.TeamMemberRole = swapRole;
                foundTeamMember.TeamMemberRole = RoleID;

                List<TableTeamMember> swap = new List<TableTeamMember>();
                swap.Add(teamMemberToSwapWith);
                swap.Add(foundTeamMember);
                return swap;
            }
            else
            {
                foundTeamMember.TeamMemberRole = RoleID;

                List<TableTeamMember> swap = new List<TableTeamMember>();
                swap.Add(foundTeamMember);
                return swap;
            }


        }
        private async Task<ActionResult> UpdateTeam(TeamSubmissionAdmin ts)
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

                    //update team members divisionID
                    if (ts.TeamDivisionID != null && ts.TeamDivisionID != foundTeam.TeamDivisionId)
                    {
                        foreach (var member in foundMembers)
                        {
                            member.TeamMemberDivisionId = (int)ts.TeamDivisionID;
                        }
                        _db.TableTeamMembers.UpdateRange(foundMembers);
                        await _db.SaveChangesAsync();
                    }

                    if (ts.Captain?.TeamCaptainPlayerID != null)
                    {
                        if (await _validationService.CheckIfCaptainIsTaken((int)ts.Captain?.TeamCaptainPlayerID, foundTeam.TeamId))
                        {
                            return new ObjectResult("Teamcaptain already taken.") { StatusCode = 400 }; //BAD REQUEST
                        }
                        else
                        {
                            if (ts.Captain.TeamCaptainPlatformID == null || ts.Captain.TeamCaptainPlayerName == null)
                            {
                                return new ObjectResult("Not all info provided for Teamcaptain.") { StatusCode = 400 }; //OK
                            }

                            TableTeamMember TeamCaptain = foundMembers.Where(m => m.TeamMemberPlayerId == ts.Captain.TeamCaptainPlayerID).FirstOrDefault();
                            //if captain isn't in the current team
                            if (TeamCaptain == null)
                            {
                                TableTeamMember tc = new TableTeamMember
                                {
                                    TeamMemberPlayerId = (int)ts.Captain.TeamCaptainPlayerID,
                                    TeamMemberAccountId = ts.Captain.TeamCaptainAccountID,
                                    TeamMemberDivisionId = ts.TeamDivisionID != null ? (int)ts.TeamDivisionID : (int)foundTeam.TeamDivisionId,
                                    TeamMemberName = ts.Captain.TeamCaptainPlayerName,
                                    TeamMemberRole = ts.Captain.TeamCaptainRoleID,
                                    TeamMemberPlatformId = ts.Captain.TeamCaptainPlatformID,
                                    TeamMemberTeamId = foundTeam.TeamId
                                };

                                _db.TableTeamMembers.Remove(await _db.TableTeamMembers.Where(m => m.TeamMemberId == foundTeam.TeamCaptainId).FirstOrDefaultAsync());
                                _db.TableTeamMembers.Add(tc);
                                await _db.SaveChangesAsync();



                                foundTeam.TeamDivisionId = ts.TeamDivisionID != null ? ts.TeamDivisionID : foundTeam.TeamDivisionId;
                                foundTeam.TeamCaptainId = tc.TeamMemberId;
                                foundTeam.TeamName = ts.TeamName;


                                _db.TableTeams.Update(foundTeam);

                                return new ObjectResult("Team updated successfully.") { StatusCode = 200 }; //OK
                            }
                            else
                            {

                                //update current team member to captain if the given captain is a team member
                                TeamCaptain.TeamMemberPlayerId = (int)ts.Captain.TeamCaptainPlayerID;
                                TeamCaptain.TeamMemberAccountId = ts.Captain.TeamCaptainAccountID;
                                TeamCaptain.TeamMemberDivisionId = ts.TeamDivisionID != null ? (int)ts.TeamDivisionID : (int)foundTeam.TeamDivisionId;
                                TeamCaptain.TeamMemberName = ts.Captain.TeamCaptainPlayerName;
                                TeamCaptain.TeamMemberRole = ts.Captain.TeamCaptainRoleID;
                                TeamCaptain.TeamMemberPlatformId = ts.Captain.TeamCaptainPlatformID;

                                _db.TableTeamMembers.Update(TeamCaptain);
                                await _db.SaveChangesAsync();



                                foundTeam.TeamDivisionId = ts.TeamDivisionID != null ? ts.TeamDivisionID : foundTeam.TeamDivisionId;
                                foundTeam.TeamCaptainId = TeamCaptain.TeamMemberId;
                                foundTeam.TeamName = ts.TeamName;

                                _db.TableTeams.Update(foundTeam);
                                await _db.SaveChangesAsync();


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
        #endregion
    }
}